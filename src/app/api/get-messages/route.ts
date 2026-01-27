import dbConnect from "@/lib/dbConnection";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import mongoose from "mongoose";
import { success } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import userModel from "@/model/user";

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(NEXT_AUTH_CONFIG);
    const _user = session?.user;

    if(!_user || !session){
        return Response.json(
            {success: false, message: 'Aunthorized'},
            {status: 401}
        );
    }

    const userID = new mongoose.Types.ObjectId(_user._id);
    
    try{
        const user = await userModel.aggregate([
            {$match: {_id: userID}},
            {$unwind: '$messages'},
            {$sort: {'$messages.createdAt': -1}},
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if(!user || user.length === 0 ){
            return Response.json(
            { message: 'User not found', success: false },
            { status: 404 }
        );
        }

        return Response.json(
        { messages: user[0].messages },
        {
            status: 200,
        }
    );
    }catch(err){
        console.error('An unexpected error occurred:', err);
        return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
    );
    }
}