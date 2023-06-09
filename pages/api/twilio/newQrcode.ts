import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';
import Report from "../../../models/report";
import mongoose from 'mongoose';

const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
const token = <string>process.env.TWILIO_AUTH_TOKEN;
const phone = <string>process.env.TWILIO_NUMBER
const client = twilio(accountSid, token);

const serverUrl = <string>process.env.SERVER_URL      
const QRCode = require('qrcode');

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
                carnumber: report[0].carowner[0].carnumber,
                totalPrice: report[0].reportfine,
                reporterPrice:report[0].reportfine * report[0].fee /100,
                date: report[0].reportdate,
                payState: "NO",
                filepath: serverUrl+report[0].reportmedia.filepath,
                reporter_name: report[0].carreporter[0].name,
                reporter_email: report[0].carreporter[0].email,
            });
            if (req.method == "POST") {

                // const number = "(02+)-(656)-6565";
                // const numericNumber = number.replace(/\D/g, '');


                // QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err:any, url:any) => {
                //     if (err) {
                //       console.error(err);
                //       return;
                //     }
                //     client.messages
                //     .create({
                //         body: 'Here is your QR code:',
                //         from: 'whatsapp:TWILIO_WHATSAPP_NUMBER',
                //         to: 'whatsapp:YOUR_REGISTERED_NUMBER',
                //         to: 'whatsapp:+'+report[0].carowner[0].phonenumber.replace(/\D/g, '');
                //         mediaUrl: url,
                //     })
                //     .then((message) => console.log(message.sid))
                //     .catch((err) => console.error(err));

                //     console.log(url); // this will print the base64 encoded image data URI
                //   });


                // QRCode.toFile(`./public/uploads/qr/_new${req.body.id}.png`, qrData, {
                //     errorCorrectionLevel: 'H'
                // }, function (err:any, url:any) {
                //     if (err) throw err;
                //     console.log(url);
                // });
                // client.messages
                // .create({
                //     body: 'Hello there!',
                //     from: 'whatsapp:+12765660430',
                //     to: 'whatsapp:+447815534760 ',
                //     // mediaUrl: ['https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'],

                //     // to:report[0].carowner[0].phonenumber
                // })
                // .then(message => console.log(message.sid));
                // res.json({
                //     success:"true"
                // })
                // client.messages
                // .create({
                //     body: `${uploadrUrl}/qr/_new${req.body.id}.png`,
                //     from: 'whatsapp:'+phone,
                //     to: 'whatsapp:+447458196483'
                //     // to:report[0].carowner[0].phonenumber
                // })
                // .then((message:any) =>{
                //     console.log(message);
                //     res.json({
                //         success: true,
                //     })
                // })
                // .catch((error:any) => {
                //     console.log(error, "sdfsdfsdf");
                //     res.json({
                //         success: "false",
                //     });
                // });
                res.json({
                    success:"true"
                })
            }
        } else {
            res.json({
                success:"false",
                message:"Unregistered Car Number"
            })
        }
    }

    // return res.status(404).send("Error")
}

export default handler;