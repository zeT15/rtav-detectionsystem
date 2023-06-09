import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TitleIcon from '@mui/icons-material/Title';
import Button from '@mui/material/Button';
// import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsIcon from '@mui/icons-material/Settings';
import {toast } from "react-toastify";
const drawerWidth = 240;

export default function Navbar(props:any){
    const {layoutData} = props;
    const router = useRouter();
    const addCarHandle = (e:any) => {
        e.preventDefault();
        console.log("");
    };
    return(
        <>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{display:"flex"}} className="admin-navbar">
                    {layoutData.user.usertype=="admin" && <IconButton  
                        color="inherit" 
                        edge="start"
                        onClick={props.priceSetModal}
                    >
                        <SettingsIcon></SettingsIcon>
                    </IconButton>
                    }
                    {/* <IconButton  
                        color="inherit" 
                        edge="start"
                        onClick={(e) => {
                            e.preventDefault();
                            axios.get("/api/test/fakereporttypes").then((res) => {
                              toast.success(res.data);
                            });
                        }}
                    >
                        <TitleIcon></TitleIcon>
                    </IconButton> */}
                    {/* <IconButton  
                        color="inherit" 
                        edge="start"
                        onClick={(e) => {
                            e.preventDefault();
                            axios.get("/api/test/fakeusers").then((res) => {
                              toast.success(res.data);
                            });
                        }}
                    >
                        <GroupAddIcon></GroupAddIcon>
                    </IconButton> */}
                    <IconButton  
                        color="inherit" 
                        edge="start"
                        onClick={props.carSetModal}
                    >
                        <DirectionsCarIcon></DirectionsCarIcon>
                    </IconButton>
                    {/* <IconButton  
                        color="inherit" 
                        edge="start"
                        onClick={(e) => {
                            e.preventDefault();
                            axios.get("/api/test/fakereports").then((res) => {
                              toast.success(res.data);
                            });
                        }}
                    >
                        <ReportProblemIcon></ReportProblemIcon>
                    </IconButton> */}
                    <IconButton
                        color="inherit"
                        aria-label="Account"
                        edge="start"
                        onClick={(e) => {
                            e.preventDefault();
                            router.push("/admin/dashboard/account");
                        }}
                    >
                        <AccountBoxIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="log out"
                        edge="start"
                        onClick={(e) => {
                            e.preventDefault();
                            axios.get("/api/auth/logout").then((res) => {
                              toast.success("Logged Out Successfully");
                              router.push("/");
                            });
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={props.mobilecontrol}
                        sx={{display: { sm: 'none' }}}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    )
}