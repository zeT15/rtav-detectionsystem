import Report from "../../../../models/report";
import Car from "../../../../models/car";
import nextSessionMiddleware from "../../../../next-middlewares/next-session-middleware";
import _ from "lodash";

const handler = async function handler(req:any, res:any) {
    if (req.method == "POST") {

        if(req.body.flag === "all" && req.session.get("user").usertype=="admin")
        {
        let reports = await Report.aggregate( [
            {
                $lookup:
                {
                    from: "cars",
                    localField: "reportedcar",
                    foreignField: "carnumber",
                    as: "inventory_docs"
                },
            },{
                $lookup:
                {
                    from: "users",
                    localField: "reportowner",
                    foreignField: "_id",
                    as: "caremployeer"
                }
            }
            ] );
        // const filterReports = reports.filter(reports => reports.inventory_docs[0].owner = req.session.get("user")._id)
        return res.status(200).send(reports);
        }
        let reports = await Report.aggregate( [
            {
                $lookup:
                {
                    from: "cars",
                    localField: "reportedcar",
                    foreignField: "carnumber",
                    as: "inventory_docs"
                },
           },{
                $lookup:{
                    from: "users",
                    localField: "reportowner",
                    foreignField: "_id",
                    as: "caremployeer"
                }
           },
           {
            $match:
            {
                "reportflag": req.body.flag,
            }
           }
         ] );
        if(req.session.get("user").usertype == "employeer") {
            const filterReports = reports.filter(reports => {
                if (reports.inventory_docs.length > 0 ){
                    if(reports.inventory_docs[0].owner == req.session.get("user")._id) {
                        return true
                    }
                }
                return false
            })
            return res.status(200).send(filterReports)
        }
        else {
            return res.status(200).send(reports)
        }
    }
    return res.status(404).send("Error")
}
export default nextSessionMiddleware(handler);
