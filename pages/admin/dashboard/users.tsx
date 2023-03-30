import React, { useEffect, useState } from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Admin from "../../../layouts/Admin";
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import UserDataGrid from "../../../components/DataGrid/UserDataGrid";
import sessionProps from "../../../next-middlewares/sessionProps";
import {toast } from "react-toastify";
import AddUserModal from "../../../layouts/AddUserModal";

const Users = ({layoutData}:InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const [data, setData] = useState([]);
    const flag = "users";
    const getdata = () => {
        axios
        .post("/api/admin/dashboard/getuserdata")
        .then((res:any) => {
            setData(res.data);
        })
        .catch((err) => {
        })
        .finally(() => {
        });
    }
    
    const updatedata = (data:any) => {
        axios
            .post("/api/admin/dashboard/setuserdata", data)
            .then((res:any) => {
                getdata();
                switch (data.permission) {
                    case "true":
                        toast.success("A userdata is changed successfully!")
                        break;
                    case "false":
                        toast.success("A user is deleted successfully!")
                    default:
                        break;
                }
            })
            .catch((err) => {
            })
            .finally(() => {
        });
    }

    useEffect(()=>{
        console.log(`This is ${flag}`);
        if(flag){
            getdata();
        }
    },[flag])

    const addUserHandle = (newUser:any) => {
        axios
        .post("/api/auth/register", newUser)
        .then((res) => {
            toast.success("Registeration Success");
            getdata();
        })
        .catch((err) => {
            if (err.response) {
                const errData = err.response.data;
                toast.error("Invalid Input.");
                for (let errKey in errData) {
                    if(errData[errKey] !== ""){
                        toast.error(errData[errKey]);
                    }
                }
            } else toast.error("Something Bad Happened");
        })
    };

    return(
        <Admin flag={flag} layoutData={layoutData}>
            <AddUserModal handleSubmit={addUserHandle}/>
            <UserDataGrid filterkey={flag} data={data} updateData={updatedata}/>
        </Admin>
    )
}

export const getServerSideProps:GetServerSideProps = async function (context:any) {
    let layoutData = await sessionProps(context);
    return { props: { layoutData } };
};

export default Users;
