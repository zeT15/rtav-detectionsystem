import User from "../../../../models/user";

import _ from "lodash";

const handler = async function handler(req:any, res:any) {
    if (req.method == "POST") {
        console.log(req.body)
        let users = await User.find();
        return res.status(200).send(users)
    }
    return res.status(404).send("Error")
}

export default handler;
