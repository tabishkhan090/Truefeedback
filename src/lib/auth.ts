import NextAuth from "next-auth";
import dbConnect from "./dbConnection";
import CredentialsProvider from "next-auth/providers/credentials";
import userModel from "@/model/user";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const NEXT_AUTH_CONFIG : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'Credentials',
            name: 'Credentials',
            credentials: {
                username: {label: 'Email', type: 'text', placeholder: ''},
                password: {label: 'password', type: 'text', placeholder: ''}
            },
            async authorize(credentials: any ) :Promise<any> {
                await dbConnect();

                try{
                    const user = await userModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    })

                    if(!user){
                        throw new Error('No user found with this email');
                    }

                    if(!user.isValid){
                        throw new Error('Please verify your account before logging in');
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(!isPasswordCorrect){
                        throw new Error('Incorrect Password!');
                    }
                    return user;
                }catch(err: any){
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks: {
        jwt: async ({token,user}: any) => {
            if(user){
                token._id = user._id?.toString(); // Convert ObjectId to string
                token.isValid = user.isValid;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        session: async ({session,user}: any) => {
            if(user){
                session._id = user._id?.toString(); // Convert ObjectId to string
                session.isValid = user.isValid;
                session.isAcceptingMessages = user.isAcceptingMessages;
                session.username = user.username;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin',
    },
};