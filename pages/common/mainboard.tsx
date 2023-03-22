import React from 'react';
import sessionProps from "../../next-middlewares/sessionProps";
import Common from "../../layouts/Common";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const Mainboard = ({layoutData}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <Common layoutData = { layoutData }>
            <div></div>
        </Common>
    );
};

export const getServerSideProps:GetServerSideProps = async function (context:any) {
    let layoutData = await sessionProps(context);
    return { props: { layoutData } };
};

export default Mainboard;


