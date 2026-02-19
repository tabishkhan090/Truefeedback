import dbConnect from "@/lib/dbConnection";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import userModel from "@/model/user";
import bcrypt from "bcryptjs";

export async function POST (request: Request) {
    await dbConnect();

    try{
        const {username, email, password} = await request.json();
        const existingUserByUsername = await userModel.findOne({
            username,
            isValid: true
        });

        if(existingUserByUsername){
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                {
                    status: 400
                }
            );
        }

        const existingUserByEmail = await userModel.findOne({
            email
        })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserByEmail){
            if(existingUserByEmail.isValid){
                return Response.json(
                {
                    success: false,
                    message: 'User already exists with this email',
                },
                {
                    status: 400
                }
            );
            }else{
                const hashPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }else{
            const hashPassword = await bcrypt.hash(password,10);
            const expirydate = new Date();
            expirydate.setHours(expirydate.getHours() + 1);

            const newUser = await userModel.create({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expirydate,
                isValid: false,
                messages: [],
                isAcceptingMessage: true,
            });

            //email verificstion
            const emailRes = await sendVerificationEmail(email, username, verifyCode);
            if(!emailRes.success){
                return Response.json(
                {
                    success: false,
                    message: emailRes.message,
                },
                { status: 500 }
            );
        }
            return Response.json(
                {
                    success: true,
                    message: 'User registered successfully. Please verify your account.',
                },
                { status: 201 }
            );
        }
    }catch(error){
        console.error('Error reg user', error);
        return Response.json(
            {
                success: false,
                message: "error reg users"
            },
            {
                status: 500
            }
        )
    }
}