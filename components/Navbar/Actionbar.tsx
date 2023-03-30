import React from "react";
import { useRouter } from "next/router";
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Button from '@mui/material/Button';
import {toast } from "react-toastify";

const drawerWidth = 240;

export default function Actionbar(props:any){
    const {layoutData} = props;
    const router = useRouter();
    const addCarHandle = (e:any) => {
        e.preventDefault();
        console.log("");
    };
    return(
        <>
            <CssBaseline />
            <Button className="mb-2 bg-blue-500" variant="contained" color="primary" endIcon={<DirectionsCarIcon/>}
                onClick={(e) => {
                    addCarHandle(e);
                }}>
                Add Car
            </Button>
        </>
    )
}