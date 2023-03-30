import User from "../../../models/user";

import _ from "lodash";

const handler = async function (req:any, res:any) {
    if (req.method == "POST") {
        const reqUser = req.body;
        let user = await User.findOne({
            _id:reqUser._id,
        });
        return res.status(200).send(user);
    }
    return res.status(404).send("Error")
}
export default handler;
