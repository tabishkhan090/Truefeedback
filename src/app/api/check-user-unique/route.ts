import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/user";
import { usernameValidation } from "@/schemas/signupSchema";
import { success, z } from 'zod';

export const userSchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect();
    try{
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username'),
        }
        const result = userSchema.safeParse(queryParams);

        if(!result.success){
            return Response.json(
                {
                    success: false,
                    message: 'invalid input'
                },
                {
                    status: 400
                }
            );
        }
        const { username } = result.data;
        const existingsUser = await userModel.findOne({
            username,
            isValid: true
        })

        if(existingsUser){
            return Response.json(
                {
                    success: false,
                    message: 'Username Already Taken'
                },
                {
                    status: 200
                }
            );
        }

        return Response.json(
        {
            success: true,
            message: 'Username is unique',
        },
        { status: 200 }
        );
        
    }catch(err){
        console.error('Error checking username:', err);
    return Response.json(
        {
            success: false,
            message: 'Error checking username',
        },
        { status: 500 }
    );
    }
}