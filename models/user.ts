import mongoose from "mongoose";
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    usertype:{
      type: String,
      required: true,
    },
    reportlimit:{
      type:Number,
    },
    reportnumber:{
      type:Number,
    },
    startdate:{
      type: Date,
      default: Date.now,
    },
    whatsapp:{
        type: String,
    },
    address: {
      type:String,
    },
    password: {
      type: String,
      required: true,
    },
    permission: {
      type: String,
      requires: true,
      default:"true",
    }
  },
  { timestamps: true }
);

var User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
