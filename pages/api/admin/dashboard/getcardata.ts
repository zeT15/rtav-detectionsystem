import Car from "../../../../models/car";
import nextSessionMiddleware from "../../../../next-middlewares/next-session-middleware";
import mongoose from "mongoose";
import _ from "lodash";

const handler = async function handler(req:any, res:any) {
    if (req.method == "POST") {
        if(req.session.get("user").usertype!="common")
        {
            if(req.session.get("user").usertype == "admin") {

                let cars = await Car.aggregate( [
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "employee",
                            foreignField: "_id",
                            as: "caremployee"
                        }
                        ,
                    },
                    {
                        $match:
                        {
                            "permission": "true",
                        }
                    }
                ] );
                return res.status(200).send(cars);
            } else {
                let cars = await Car.aggregate( [
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "employee",
                            foreignField: "_id",
                            as: "caremployee"
                        }
                        ,
                    },
                    {
                        $match:
                        {
                            permission: "true",
                            employee:new mongoose.Types.ObjectId("63f24c870d775883b9bfb3ab"), 
                        }
                    }
                ] );
                return res.status(200).send(cars);
            }
        }
    }
    return res.status(404).send("Error")
}
export default nextSessionMiddleware(handler);

