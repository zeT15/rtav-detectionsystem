import User from "../../../models/user";
import bcrypt from "bcryptjs";

const handler = async function (req:any, res:any) {
  if (req.method == "POST") {
    const _id = req.body._id;
    const currPass = req.body.currPass;
    const newPass = req.body.newPass;
    const confPass = req.body.confPass;
    let user = await User.findOne({
        _id: _id,
    });
    if (!user)
        return res.status(400).send({ error: "User not found." });
    const validPassword = await bcrypt.compare(
      currPass,
      user.password
    );
    if(!validPassword)
      return res.status(400).send({currPass: "Password incorrect."});
    if(newPass.length < 4)
      return res.status(400).send({newPass: "Password length must be at least 4 characters long."});
    if(confPass !== newPass)
      return res.status(400).send({confPass: "Password incorrect."});
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPass, salt);
    await user.save();
    return res.status(200).send("updated");
  }
  return res.status(404).send("");
};
export default handler;
