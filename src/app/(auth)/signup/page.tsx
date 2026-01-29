/*
    npx shadcd@latest init
    npx shadcd@latest add from
    -----hooks-----------
    npm install usehooks-ts
*/


'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from"@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import axios from "axios"
import { useState } from "react";

export default function SignUp(){
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isLoading, setIsLoadind] = useState(false);
    const [isSubmitting, setisSubmitting] = useState(false);


}