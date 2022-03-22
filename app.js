const express = require("express");

const app = express();

const path = require("path");

const port = process.env.PORT || 5050;

app.use(express.static("build"));
// app.get("/", (req, res) => {
//   req.sendFile(path.resolve(__dirname, "build", "index.html"));
// });

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log("App running on port: ", port);
});
