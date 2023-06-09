import mongoose from "mongoose";
var Schema = mongoose.Schema;
const User = require("./user");

var reportSchema = new Schema(
    {
      reportowner: {
        type: mongoose.Types.ObjectId, 
        ref: "User"
      },
      reporttype: {
        type: String,
        required: true,
      },
      reportmedia: {
        filetype: {
          type: String,
        },
        filepath: {
          type:String,
        }
      },  
      reportgps: {
        type: String,
        required: true,
      },
      reportdate:{
          type: Date,
          required:true,
      },
      reportfine:{
        type: Number,
      },
      reportedcar:{
        type:String,
      },
      sendedwhatsapp: {
        type:String,
      },
      reportflag:{
        type: String,
        required:true,
      },
      fee:{
        type:Number,
        default: 90,
      }
    },
    { timestamps: true }
  );
  
  var Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
  
  export default Report;
  