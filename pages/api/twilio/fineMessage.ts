import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
    const token = <string>process.env.TWILIO_AUTH_TOKEN;
    const phone = <string>process.env.TWILIO_NUMBER
    const client = twilio(accountSid, token);
    
    const uploadrUrl = <string>process.env.UPLOAD_URL     

    if (req.method == "POST") {
        client.messages
        .create({
            body: `${uploadrUrl}/qr/_check${req.body.id}.png`,
            from: phone,
            to: '+447458196483'
        })
        .then((message:any) =>{
            console.log(message);
            res.json({
                success: "true",
            })
        })
        .catch((error:any) => {
            // console.log(error);
            res.json({
                success: "false",
            });
        });
    }
    // return res.status(404).send("Error")
}

export default handler;