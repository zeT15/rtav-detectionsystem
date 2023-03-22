import React, { useEffect, useState } from "react";
import {useRouter} from "next/router";
import axios from "axios";

import Admin from "../../../layouts/Admin";
import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import CarDataGrid from "../../../components/DataGrid/CarDataGrid";
import sessionProps from "../../../next-middlewares/sessionProps";
import { toast } from "react-toastify";


const Cars = ({layoutData}:InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [data, setData] = useState([])
    const router = useRouter();
    const flag = "cars";
    const getdata = () => {
        axios
        .post("/api/admin/dashboard/getcardata")
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
            .post("/api/admin/dashboard/setcardata", data)
            .then((res:any) => {
                switch (data.permission) {
                    case "true":
                        toast.success("A cardata is changed successfully!")
                        getdata();
                        
                        break;
                    case "false":
                        toast.success("A car is deleted successfully!")
                        getdata();
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
            <CarDataGrid filterkey={flag} data={data} updateData={updatedata}/> 
        </Admin>
    )
}

export const getServerSideProps:GetServerSideProps = async function (context:any) {
    let layoutData = await sessionProps(context);
    return { props: { layoutData } };
};
export default Cars;
