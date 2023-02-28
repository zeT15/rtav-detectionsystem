import Car from "../../../../models/car";

import _ from "lodash";

const handler = async function handler(req:any, res:any) {
    console.log(req.body)
    if (req.method == "POST") {
        const filter = {_id:req.body._id};
        const data = {
            carnumber:req.body.carnumber,
            phonenumber:req.body.phonenumber,
            permission:req.body.permission
        }
        await Car.findOneAndUpdate(filter, data);
        return res.status(200).send("Success")
    }
    return res.status(404).send("Error")
}

export default handler;
