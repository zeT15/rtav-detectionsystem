import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';
import Report from "../../../models/report";
import mongoose from 'mongoose';
const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
    const token = <string>process.env.TWILIO_AUTH_TOKEN;
    const phone = <string>process.env.TWILIO_NUMBER
    const client = twilio(accountSid, token);
    
    const uploadrUrl = <string>process.env.UPLOAD_URL     
    const QRCode = require('qrcode');
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
                as: "caremployee"
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
        if(report[0].caremployee.length > 0) {
            const qrData = JSON.stringify({
                id: report[0]._id,
                carnumber: report[0].caremployee[0].carnumber,
                totalPrice: report[0].reportfine,
                reporterPrice:report[0].reportfine * 0.9,
                date: report[0].reportdate,
                payState: "NO",
                filepath: report[0].reportmedia.filepath,
                reporter_name: report[0].carreporter[0].name,
                reporter_email: report[0].carreporter[0].email,
            });
            if (req.method == "POST") {
                QRCode.toFile(`./public/uploads/qr/_new${req.body.id}.png`, qrData, {
                    errorCorrectionLevel: 'H'
                }, function (err:any) {
                    if (err) throw err;
                });
                client.messages
                .create({
                    body: `${uploadrUrl}/qr/_new${req.body.id}.png`,
                    from: phone,
                    to: '+447458196483'
                    // to:report[0].caremployee[0].phonenumber
                })
                .then((message:any) =>{
                    // console.log(message);
                    res.json({
                        success: true,
                    })
                })
                .catch((error:any) => {
                    // console.log(error);
                    res.json({
                        success: false,
                    });
                });
            }
        } else {
            res.json({
                success:false
            })
        }
    }

    // return res.status(404).send("Error")
}

export default handler;