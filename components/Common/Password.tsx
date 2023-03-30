import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface ErrorTypes{
    name: string,
    email: string,
    password: string
}

export default function Password(props:any){
    const user = props.data?props.data:{user:null};
    const [currPass, setCurrPass] = React.useState("");
    const [newPass, setNewPass] = React.useState("");
    const [confPass, setConfPass] = React.useState("");
    const [errors, setErrors] = React.useState({currPass:null, newPass:null, confPass:null});
    const [fetching, setFetching] = React.useState(false);

    const handleSubmit = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        e.preventDefault();
        setFetching(true);
        user.currPass = currPass;
        user.newPass = newPass;
        user.confPass = confPass;
        axios
        .post("/api/auth/updateUserPassword", user)
        .then((res) => {
          toast.success("Password changed.");
          setErrors({currPass:null, newPass:null, confPass:null});
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            toast.error("Change password failed.");
            setErrors(err.response.data);
          } else toast.error("Something Bad Happened");
        })
        .finally(() => {
          setFetching(false);
        });
    }

    return(
        <div className="w-full">
            <label className="block font-bold mb-2 text-2xl text-black text-sm" htmlFor="label">
                Change Password
            </label>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current password">
                        Current Password
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="currPass" 
                        type="password" 
                        placeholder="Current Password"
                        disabled={fetching}
                        value={currPass}
                        onChange={(e) => {setCurrPass(e.target.value)}}
                    />
                    <p className="text-red-500 text-xs italic">{errors.currPass}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="New Password">
                        New Password
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="newPass" 
                        type="password" 
                        placeholder="New Password"
                        disabled={fetching} 
                        value={newPass}
                        onChange={(e) => {setNewPass(e.target.value)}} 
                    />
                    <p className="text-red-500 text-xs italic">{errors.newPass}</p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm password">
                        Confirm Password
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        id="confPass" 
                        type="password" 
                        placeholder="Confirm Password" 
                        disabled={fetching} 
                        value={confPass}
                        onChange={(e) => {setConfPass(e.target.value)}}
                    />
                    <p className="text-red-500 text-xs italic">{errors.confPass}</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={(e)=>handleSubmit(e)}>
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}

