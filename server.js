const express = require("express");
const mongoose = require("mongoose");
const next = require("next");
const fileUpload = require("express-fileupload");


const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
console.log(process.env.NODE_ENV);
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  // server.use(fileUpload())

  server.use("/upload", express.static(__dirname + "/public/uploads"));
  console.log(__dirname + "/public/uploads");
  server.all("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });
  mongoose
    .connect(process.env.DB_CONNECTION_STRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("DB Connected: " + process.env.DB_CONNECTION_STRING);
    })
    .catch((err) => {
      console.log("Unable to Connect to DB:" + process.env.DB_CONNECTION_STRING);
    });
});
