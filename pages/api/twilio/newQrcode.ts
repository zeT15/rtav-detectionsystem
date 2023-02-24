import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
    const token = <string>process.env.TWILIO_AUTH_TOKEN;
    const phone = <string>process.env.TWILIO_NUMBER
    const client = twilio(accountSid, token);
    
    
    const uploadrUrl = <string>process.env.UPLOAD_URL     
    const QRCode = require('qrcode');

    if (req.method == "POST") {
        const qrData = JSON.stringify(req.body);
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
        })
        .then((message) =>
            res.json({
                success: true,
            })
        )
        .catch((error) => {
            console.log(error);
            res.json({
                success: false,
            });
        });
    }
    return res.status(404).send("Error")
}

export default handler;