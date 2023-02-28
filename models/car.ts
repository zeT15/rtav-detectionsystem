import mongoose from "mongoose";
var Schema = mongoose.Schema;

var carSchema = new Schema(
    {
      phonenumber:{type: String},
      carnumber: {
        type: String,
        required: true,
      },
      employee: {type: mongoose.Types.ObjectId},
      permission: {type:String, default:"true", required:true}
    },
    { timestamps: true }
);

var Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car;
