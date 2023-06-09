import React from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

import Auth from "../../layouts/Auth";


interface ErrorTypes{
    name: string,
    email: string,
    password: string
}

export default function Register(){

    const router = useRouter()
    const [user, setUser] = React.useState({name:"",email:"",password:"",whatsapp:""})
    const [errors, setErrors] = React.useState({name:null, email:null, password:null, whatsapp:null});
    const [fetching, setFetching] = React.useState(false);
    const [isZim, setIsZim] = React.useState(true);

    const changeZimbabweNumber = () => {
        let wNum = user.whatsapp;
        if(!wNum)
            wNum = "";
        if(!isZim){
            if(wNum.substring(0,1) === "+"){
                wNum = wNum.substring(1);
            }
            if(wNum.substring(0,1) === "0"){
                wNum = wNum.substring(1);
            }
            wNum = "+263" + wNum;
        }else{
            if(wNum.substring(0,1) === "+"){
                wNum = wNum.substring(1);
            }
            if(wNum.substring(0,3) === "263"){
                wNum = wNum.substring(3);
            }
            wNum = "+" + wNum;
        }
        setIsZim(!isZim);
        setUser({ ...user, whatsapp: wNum });
    };

    const handleSubmit = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        e.preventDefault();
        setFetching(true);
        axios
        .post("/api/auth/register", user)
        .then((res) => {
          toast.success("Registeration Success");
          router.push("/auth/login");
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            toast.error("Registeration failed");
            setErrors(err.response.data);
          } else toast.error("Something Bad Happened");
        })
        .finally(() => {
          setFetching(false);
        });
    }

    return(
        <Auth>
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            User Name
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            id="username" 
                            type="text" 
                            placeholder="someone"
                            disabled={fetching} 
                            value={user.name}
                            onChange={(e) => {setUser({ ...user, name: e.target.value })}} 
                        />
                        <p className="text-red-500 text-xs italic">{errors.name}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="useremail">
                            Email
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            id="useremail" 
                            type="email" 
                            placeholder="someone@gmail.com"
                            disabled={fetching} 
                            value={user.email}
                            onChange={(e) => {setUser({ ...user, email: e.target.value })}} 
                        />
                        <p className="text-red-500 text-xs italic">{errors.email}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userwhatsapp">
                            WhatsApp Number
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            id="userwhatsapp" 
                            type="text" 
                            placeholder="+263 00 000 0000"
                            disabled={fetching} 
                            value={user.whatsapp}
                            onChange={(e) => {setUser({ ...user, whatsapp: e.target.value })}} 
                        />
                        <p className="text-red-500 text-xs italic">{errors.whatsapp}</p>
                        <input
                            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="isZimbabwe"
                            type="checkbox"
                            disabled = {fetching}
                            onChange = {(e) => {changeZimbabweNumber()}}
                            checked = {isZim?true:false}
                        />
                        <span className="ml-1 text-black text-xs">
                            Zimbabwe Number
                        </span>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                            id="userpassword" 
                            type="password" 
                            placeholder="******" 
                            disabled={fetching} 
                            value={user.password}
                            onChange={(e) => {setUser({ ...user, password: e.target.value })}} 
                        />
                        <p className="text-red-500 text-xs italic">{errors.password}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={(e)=>handleSubmit(e)}>
                            Sign Up
                        </button>
                        <p className="text-black text-xs">
                            <Link href="/auth/login" className="text-orange-700">
                                Already Registered?
                            </Link>
                        </p>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2023 Mujiba. All rights reserved.
                </p>
            </div>
        </Auth>
    )
}