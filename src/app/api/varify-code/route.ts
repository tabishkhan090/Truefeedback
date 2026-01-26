import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/user";

export async function POST(request: Request){
    dbConnect();

    try{
        const {username, code } = await request.json();
        const user = await userModel.findOne({
            username
        });

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                {
                    status: 500
                }
            );
        }

        const isCodeValid = user.verifyCode == code;
        const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpire){
            user.isValid = true;
            await user.save();
            return Response.json(
            { success: true, message: 'Account verified successfully' },
            { status: 200 }
        );
        }
        else if(!isCodeNotExpire){
            return Response.json(
            { success: false, message: 'Code Expired' },
            { status: 400 }
            );
        }
        else{
            return Response.json(
            { success: false, message: 'Incorrect Code' },
            { status: 400 }
            );
        }
    }catch(err){
        console.error('Error verifying user:', err);
        return Response.json(
        { success: false, message: 'Error verifying user' },
        { status: 500 }
    );
    }
}