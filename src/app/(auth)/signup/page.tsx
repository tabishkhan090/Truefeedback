/*
    npx shadcd@latest init
    npx shadcd@latest add from
    -----hooks-----------
    npm install usehooks-ts
*/

/*
    Here we don't need to use Debounce because we are using introducing FORM a feature if a person click on onSbmit then only the req goes to backend.
    we're useing bcoz checking username is uniqueness or not in real-time.
*/
'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from"@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts"
import { apiResponse } from "@/types/ApiResponse";
import { signupSchema } from "@/schemas/signupSchema";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

export default function SignUp(){
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setisSubmitting] = useState(false);

    const debounceUsername = useDebounceValue(username, 300);

    /* 
        function useDebounceValue( value, delay ) {
            const [debounce, setdebounce] = useState(value);
            useEffect( () => {
                    const handler = setTimeout(()=> {
                        setdebounce(value)
                    }, delay)

                return ()=> {
                    clearTimeout(handler);
                }
            }
            ,[value,delay])
            return debounce;
        };
        export default useDebounceValue
    */
    
    //zod validation
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            password: '',
            email: ''
        },
    })

    //Expensive OP (Checking Is-Username is unique)
    useEffect( ()=>{
        const checkUsernameUnique = async ()=>{
            setUsernameMessage('');
            setIsLoading(true);
            try{
                const result = await axios.get<apiResponse>(`api/check-user-unique?username=${debounceUsername}`);
                setUsernameMessage(result.data.messages);
            }catch(err){
                const axiosError = err as AxiosError<apiResponse>;
                setUsernameMessage(axiosError.response?.data.messages ?? 'error checking username');
            }finally{
                setIsLoading(false);
            }
        }
        checkUsernameUnique();
    },[debounceUsername])

        const router = useRouter();
        const { toast } = useToast();

    //Actions on onSubmittng;
    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setisSubmitting(true);
        try{
            const response = await axios.post<apiResponse>('api/signup', data);
            toast({
                title: 'success',
                description: response.data.messages,
            })
            router.replace(`/verify${username}`);
            setisSubmitting(false);
        }catch(err){
            console.error('Error during sign-up:', err);

        const axiosError = err as AxiosError<apiResponse>;

        // Default error message
        let errorMessage = axiosError.response?.data.messages;
        ('There was a problem with your sign-up. Please try again.');

        toast({
            title: 'Sign Up Failed',
            description: errorMessage,
            variant: 'destructive',
        });

        setisSubmitting(false);
        }
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <Input
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                setUsername(e.target.value);
                            }}
                        />
                            {isLoading && <Loader2 className="animate-spin" />}
                            {!isLoading && usernameMessage && (
                            <p
                                className={`text-sm ${
                                    usernameMessage === 'Username is unique'
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }`}
                                >
                                {usernameMessage}
                            </p>
                        )}
                        <FormMessage />
                        </FormItem>
                        )}
                        />

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <Input
                            {...field}
                        />
                            <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                            {isLoading && <Loader2 className="animate-spin" />}
                        <FormMessage />
                        </FormItem>
                        )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" {...field} name="password" />
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting}>
                            isSubmitting ? ( 
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                                </>
                            ) : 'Signup'
                        </Button>
                </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}