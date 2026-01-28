import dbConnect from "@/lib/dbConnection";
import userModel, { Message } from "@/model/user";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request: Request){
    await dbConnect();

    const { username, content } = await request.json();
    try{
        const checkMessageSchema = messageSchema.safeParse(content);
        if(!checkMessageSchema.success){
            return Response.json(
                {success: false, message: 'Invalid message Schema'},
                {status: 400}
            );
        }

        const user = await userModel.findOne({username});

        if(!user){
            return Response.json(
                {success: false, message: 'User not found'},
                {status: 404}
            );
        }

        if(!user.isAcceptingMessage){
            return Response.json(
                {success: false, message: 'User is not accepting messages'},
                {status: 403}
            );
        }

        const newMessage = { content, createdAt: new Date()};

        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
    );
    }catch(err){
        console.error('Error adding message:', err);
    return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
    );
    }
}