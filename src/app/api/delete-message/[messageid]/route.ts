import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { User } from "next-auth";
import userModel from "@/model/user";
import dbConnect from "@/lib/dbConnection";
import { NEXT_AUTH_CONFIG } from "@/lib/auth"
import { success } from "zod";

export async function DELETE(request: Request , {params} : {params : { messageid: string } }) {
    const messageId = params.messageid;
    dbConnect();
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    const _user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try{
        const result = await userModel.updateOne(
            {_id: _user._id},
            {$pull: {messages: {_id: messageId}}}
        )
        if(result.modifiedCount==0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                {status: 404}
            )
        }
        return Response.json(
                {
                    success: true,
                    message: "Message deleted"
                },
                {status: 200}
            )
    }catch(err){
        console.log("error is delete route ", err)
        return Response.json(
                {
                    success: false,
                    message: "Error deleting Mesaage"
                },
                {status: 500}
            )
    }
}   