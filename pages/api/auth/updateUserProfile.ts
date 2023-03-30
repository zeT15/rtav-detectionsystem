import User from "../../../models/user";
import signupValidator from "../../../validators/auth/signupValidator";

const handler = async function (req:any, res:any) {
  if (req.method == "POST") {
    const email = req.body.email;
    const name = req.body.name;
    const whatsapp = req.body.whatsapp;
    const _id = req.body._id;
    let errors = { email:"", name:"", whatsapp:"" };
    if(!email)
        errors = {...errors, email:"email failed invalid."};
    let emailUser = await User.findOne({
        email:email,
    });
    if(emailUser){
        if(emailUser._id !== _id){
            return res.status(400).send({ email: "User email already exists." });
        }
    }
    if(!name)
        errors = {...errors, name:"name failed invalid."};
    if(!whatsapp)
        errors = {...errors, whatsapp:"whatsapp failed invalid."};
    if (errors.email || errors.name || errors.whatsapp) return res.status(400).json(errors);
    let user = await User.findOne({
        _id: _id
    });
    if (!user)
        return res.status(400).send({ email: "User not found." });
    user.email = req.body.email;
    user.name = req.body.name;
    user.whatsapp = req.body.whatsapp;
    await user.save();
    return res.status(200).send("updated");
  }
  return res.status(404).send("");
};
export default handler;