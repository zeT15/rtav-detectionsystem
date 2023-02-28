import Car from "../../../../models/car";
import User from "../../../../models/user";
import nextSessionMiddleware from "../../../../next-middlewares/next-session-middleware";
import mongoose from "mongoose"

import _ from "lodash";

const handler = async function handler(req:any, res:any) {
    if (req.method == "POST") {
        let user = await User.findOne({_id:new mongoose.Types.ObjectId(req.session.get("user")._id)})
        if(user.usertype != "common") {
            const car = await Car.findOne({carnumber:req.body.carnumber})
            if(!car) {
                let newcar = new Car({ 
                    carnumber: req.body.carnumber, 
                    employee: new mongoose.Types.ObjectId(req.session.get("user")._id), 
                    phonenumber: req.body.carownerPhone 
                })
                newcar.save();
                res.json({
                    state:"success",
                    message:"A car is registerd successfully!"
                })
            }else {
                res.json({
                    state:"error",
                    message:"The car already exists"
                })
            }
        } else {
            res.json({
                state:"error",
                message:"You are not employee!"
            })
        }

        // let employee = await Car.findOne({email: req.body.email});

    }else {
        return res.status(404).send("Error")
    }
}
export default nextSessionMiddleware(handler);
