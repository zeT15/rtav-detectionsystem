import User from "../../../../models/user";

import _ from "lodash";

const handler = async function handler(req:any, res:any) {
    if (req.method == "POST") {
        const filter = {_id:req.body._id};
        const data = {
            whatsapp:req.body.whatsapp,
            usertype:req.body.type,
        }
        await User.findOneAndUpdate(filter, data);
        return res.status(200).send("Success")
    }
    return res.status(404).send("Error")
}

export default handler;
