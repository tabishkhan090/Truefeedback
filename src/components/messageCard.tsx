'use client'
import React from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from "@/components/ui/use-toast";
import { Message } from '@/model/user';
import { apiResponse } from "@/types/ApiResponse";

type MessageCardProps = { 
    message: Message,
    onMessageDelete: (id: string) => void
}

export default function MessageCard({ message, onMessageDelete } : MessageCardProps){

    const { toast } = useToast();
    const handleDeleteConfirm = async () => {
        try {
                const response = await axios.delete<apiResponse>(
                    `/api/delete-message/${message._id}`
                );
                toast({
                    title: response.data.messages,
                });
                onMessageDelete(message._id.toString());

            } catch (error) {
                const axiosError = error as AxiosError<apiResponse>;
                toast({
                    title: 'Error',
                    description:
                    axiosError.response?.data.messages ?? 'Failed to delete message',
                    variant: 'destructive',
                });
        } 
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant='destructive'>
                        <X className="w-5 h-5" />
                    </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete
                                this message.
                            </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>
                    {new Date(message.createdAt).toLocaleString()}
                </CardDescription>
            </CardHeader> 
            <CardContent>
            </CardContent>
        </Card>
    )
}   