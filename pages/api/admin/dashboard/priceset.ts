import Report from "../../../../models/report";

import _ from "lodash";

const handler = async function handler(req:any, res:any) {
    if (req.method == "POST") {
        await Report.updateMany({fee:req.body.price});
        return res.status(200).send("Success")
    }else {
        return res.status(404).send("Error")
    }
}

export default handler;
