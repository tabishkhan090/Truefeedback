import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/user";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { User } from "next-auth";

//it will update
export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(NEXT_AUTH_CONFIG);
    const user: User = session?.user;

    if(!session || !session.user){
        return Response.json(
            {success: false, messages: 'Not Authenticated'},
            {status: 401}
        )

        const userId = user._id;
        const { acceptMessages } = await request.json();
        
        try{
            const updateUser = userModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            {new: true}
        );

        if(!updateUser){
            return Response.json(
            {success: false, messages: 'Unable to find user to update message acceptance status'},
            {status: 404}
        );
        }

        return Response.json(
            {success: true, messages: 'Message acceptance status updated successfully'},
            {status: 200}
        );

        }catch(err){
            return Response.json(
            {success: false, messages: 'Unable to find user to update message acceptance status'},
            {status: 500}
        );
        }
    }
}
// it will just tell if user is accepting message or not
export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(NEXT_AUTH_CONFIG);
    const user: User = session?.user;

    if(!session || !session.user){
        return Response.json(
            {success: false, messages: 'Not Authenticated'},
            {status: 401}
        )
    }

    const userId = user._id;
    try{
        const existingUser = await userModel.findById(userId);

        if(!existingUser){
            return Response.json(
                {success: false, message: 'Not found'},
                {status: 404}
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: existingUser.isAcceptingMessage
            },
            {
                status: 200
            }
        )

    }catch(err){
        return Response.json(
                {success: false, message: 'Error'},
                {status: 500}
            )
    }
}