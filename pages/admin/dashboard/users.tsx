import React, { useEffect, useState } from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Admin from "../../../layouts/Admin";
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import UserDataGrid from "../../../components/DataGrid/UserDataGrid";
import sessionProps from "../../../next-middlewares/sessionProps";
import {toast } from "react-toastify";

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

    return(
        <Admin flag={flag} layoutData={layoutData}>
            <UserDataGrid filterkey={flag} data={data} updateData={updatedata}/>
        </Admin>
    )
}

export const getServerSideProps:GetServerSideProps = async function (context:any) {
    let layoutData = await sessionProps(context);
    return { props: { layoutData } };
};

export default Users;
