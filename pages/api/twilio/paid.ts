import { NextApiRequest, NextApiResponse } from 'next';
import Report from "../../../models/report";

import mongoose from 'mongoose';

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {

    
    const uploadrUrl = <string>process.env.UPLOAD_URL     

    if (req.method == "POST") {
        console.log(req.body)
        res.json({
            success:true
        })
    }
    // return res.status(404).send("Error")
}

export default handler;