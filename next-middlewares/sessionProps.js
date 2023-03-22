import nextSessionMiddleware from "./next-session-middleware";
const sessionProps = async ({ req, res }) => {
  let user = await req.session.get("user");
  if (!user) user = {};
  return { user };
};
export default nextSessionMiddleware(sessionProps);
