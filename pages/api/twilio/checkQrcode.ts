import { NextApiRequest, NextApiResponse } from 'next';

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    const QRCode = require('qrcode');

    if (req.method == "POST") {
        const qrData = JSON.stringify(req.body);
        QRCode.toFile(`./public/uploads/qr/_check${req.body.id}.png`, qrData, {
            errorCorrectionLevel: 'H'
        }, function (err:any) {
            if (err) throw err;
        });
    }
    // return res.status(404).send("Error")
}

export default handler;