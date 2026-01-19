import { Message } from "@/model/user";

export interface apiResponse {
    success: boolean,
    messages: string,
    isAcceptingMessages?: boolean,
    message?: Array<Message>
}