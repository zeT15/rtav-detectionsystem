import { NextApiRequest, NextApiResponse } from 'next';
import Report from "../../../models/report";
import mongoose from 'mongoose';
const QRCode = require('qrcode');
const serverUrl = <string>process.env.SERVER_URL    

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    let report = await Report.aggregate([
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
        }, {
            $lookup:
            {
                from: "users",
                localField: "reportowner",
                foreignField: "_id",
                as: "carreporter"
            }
            ,
        },
    ]);

    if (report.length > 0) {
        if (report[0].carowner.length > 0) {
            const qrData = JSON.stringify({
                id: report[0]._id,
                carnumber: report[0].carowner[0].carnumber,
                totalPrice: report[0].reportfine,
                reporterPrice: report[0].reportfine * report[0].fee / 100,
                date: report[0].reportdate,
                payState: req.body.state == "check" ? "NO" : "YES",
                filepath: serverUrl+report[0].reportmedia.filepath,
                reporter_name: report[0].carreporter[0].name,
                reporter_email: report[0].carreporter[0].email,
            });
            if (req.method == "POST") {
                QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err: any, url: any) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    res.json({
                        success: "true",
                        message: url
                    }); // this will print the base64 encoded image data URI
                });
            }
        } else {
            res.json({
                success: "false",
                message: "Something wrong"
            })
        }
    }

    // return res.status(404).send("Error")
}

export default handler;