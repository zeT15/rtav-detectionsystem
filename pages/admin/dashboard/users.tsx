import React, { useEffect, useState } from "react";
import {useRouter} from "next/router";
import axios from "axios";

import Admin from "../../../layouts/Admin";
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import UserDataGrid from "../../../components/DataGrid/UserDataGrid";
import sessionProps from "../../../next-middlewares/sessionProps";



const Users = ({layoutData}:InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const [data, setData] = useState([])
    const router = useRouter()
    const flag = "users";


    const getdata = () => {
        axios
        .post("/api/admin/dashboard/getuserdata", {flag:'users'})
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
            })
            .catch((err) => {
            })
            .finally(() => {
        });
    }

    useEffect(()=>{
        console.log(`This is ${flag}`);
        if(flag){
            console.log("log", "flag");
            getdata();
        }
    },[flag])

    return(
        <Admin layoutData={layoutData}>
            <UserDataGrid filterkey={flag} data={data} updateData={updatedata}/>
        </Admin>
    )
}


export default Users;

export const getServerSideProps:GetServerSideProps = async function (context:any) {
    let layoutData = await sessionProps(context);
    return { props: { layoutData } };
};