
const accountSid = "ACfbc7caff58064f7265716b4b43df042c";
const authToken = "740e83a5ff2bf7cb65f296d54cb5e86b";
const client = require('twilio')(accountSid, authToken);

const handler = async function handler(req:any, res:any) {
    if (req.method == "POST") {
        client.messages
        .create({
            body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
            from: '+15017122661',
            to: '+33644621317'
        })
        .then(message => console.log(message.sid));
    }
    return res.status(404).send("Error")
}

export default handler;