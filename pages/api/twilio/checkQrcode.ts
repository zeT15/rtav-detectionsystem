import { NextApiRequest, NextApiResponse } from 'next';
import Report from "../../../models/report";
import twilio from 'twilio';
const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
const token = <string>process.env.TWILIO_AUTH_TOKEN;
const whatsapp = <string>process.env.TWILIO_NUMBER;
import mongoose from 'mongoose';
const QRCode = require('qrcode');
const client = twilio(accountSid, token);
const serverUrl = <string>process.env.SERVER_URL     

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    let report = await Report.aggregate( [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.body.id),
            }
        },
        {
            $lookup:
            {
                from: "cars",
                localField: "reportedcar",
                foreignField: "carnumber",
                as: "carowner"
            },
        },{
            $lookup:
            {
                from: "users",
                localField: "reportowner",
                foreignField: "_id",
                as: "carreporter"
            }
          ,
        },
    ] );
    if(report.length>0) {
        if(report[0].carowner.length > 0) {
            const qrData = JSON.stringify({
                id: report[0]._id,
                carnumber: report[0].carowner.length > 0 ? report[0].carowner[0].carnumber : " ",
                totalPrice: report[0].reportfine,
                reporterPrice:report[0].reportfine * report[0].fee /100,
                date: report[0].reportdate,
                payState: "YES",
                filepath:serverUrl + report[0].reportmedia.filepath,
                reporter_name: report[0].carreporter[0].name,
                reporter_email: report[0].carreporter[0].email,
            });
            QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err:any, url:any) => {
                if (err) {
                    console.error(err);
                    return;
                }
                client.messages
                .create({
                    body: 'Here is your QR code:',
                    from: 'whatsapp:' + whatsapp,
                    // to: 'whatsapp:YOUR_REGISTERED_NUMBER',
                    to: 'whatsapp:+' + report[0].carreporter[0].whatsapp.replace(/\D/g, ''),
                    mediaUrl: url,
                })
                .then((message) => console.log(message.sid))
                .catch((err) => console.error(err));

                console.log(url); // this will print the base64 encoded image data URI
                });
            res.json({
                success:"true"
            })
        } else {
            res.json({
                success:"false"
            })
        }
    }
    // return res.status(404).send("Error")
}

export default handler;