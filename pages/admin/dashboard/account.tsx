import React from "react";
import { useRouter } from "next/router";
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Admin from "../../../layouts/Admin";
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import Profile from "../../../components/Common/Profile";
import Password from "../../../components/Common/Password";
import sessionProps from "../../../next-middlewares/sessionProps";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
}));

const Account = ({ layoutData }:InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const { flag } = router.query;
    
    return(
        <Admin flag={flag} layoutData={layoutData}>
            <Stack direction="row" spacing={2}>
                <Item>
                    <Profile data={ layoutData.user } />
                </Item>
                <Item>
                    <Password data={ layoutData.user } />
                </Item>
            </Stack>
        </Admin>
    )
}

export const getServerSideProps:GetServerSideProps = async function (context:any) {
    let layoutData = await sessionProps(context);
    let response = await axios.post("http://localhost:3000/api/auth/getuserdatabyid", layoutData?.user);
    layoutData.user = response.data;
    return { props: { layoutData } };
};

export default Account;
