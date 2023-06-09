import React, { useEffect, useState } from "react";
import {useRouter} from "next/router";
import axios from "axios";

import Admin from "../../../layouts/Admin";
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import ReportDataGrid from "../../../components/DataGrid/ReportDataGrid";
import sessionProps from "../../../next-middlewares/sessionProps";

const Dashboard = ({ layoutData }:InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [data, setData] = useState([])
    const router = useRouter()

    const { flag } = router.query
    const getdata = () => {
        axios
        .post("/api/admin/dashboard/getdata", {flag:flag})
        .then((res:any) => {
            setData(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
        });
    }
    
    const updatedata = (data:any) => {
        axios.post("/api/admin/dashboard/setdata", data)
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
            console.log("log", flag);
            getdata();
        }
    },[flag])

    return(
        <Admin flag={flag} layoutData={layoutData}>
            <ReportDataGrid filterkey={flag} data={data} updateData={updatedata}/>
        </Admin>
    )
}

export const getServerSideProps:GetServerSideProps = async function (context:any) {
    let layoutData = await sessionProps(context);
    return { props: { layoutData } };
};

export default Dashboard;
