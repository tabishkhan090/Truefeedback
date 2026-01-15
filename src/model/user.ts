import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document{
    context : string,
    createdAt: Date
}

const MessageSchema : Schema<Message> = new mongoose.Schema({
    context: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isValid: boolean,
    messages: Message,
    isAcceptingMessages: boolean,
};

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        unique: true
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
        unique: true
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
        unique: true
    },
    isValid: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
})

const userModel = 
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>('user', userSchema);

export default userModel;