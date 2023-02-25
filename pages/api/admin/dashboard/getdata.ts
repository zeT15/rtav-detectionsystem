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
                    as: "caremployee"
                },
            },{
                $lookup:
                {
                    from: "users",
                    localField: "reportowner",
                    foreignField: "_id",
                    as: "carreporter"
                }
            }
            ] );
        // const filterReports = reports.filter(reports => reports.caremployee[0].owner = req.session.get("user")._id)
        return res.status(200).send(reports);
        }
        let reports = await Report.aggregate( [
            {
                $lookup:
                {
                    from: "cars",
                    localField: "reportedcar",
                    foreignField: "carnumber",
                    as: "caremployee"
                },
           },{
                $lookup:{
                    from: "users",
                    localField: "reportowner",
                    foreignField: "_id",
                    as: "carreporter"
                }
           },
           {
            $match:
            {
                "reportflag": req.body.flag,
            }
           }
         ] );
        if(req.session.get("user").usertype == "employee") {
            const filterReports = reports.filter(reports => {
                if (reports.caremployee.length > 0 ){
                    if(reports.caremployee[0].owner == req.session.get("user")._id) {
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
