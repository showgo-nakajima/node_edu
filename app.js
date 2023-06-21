const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = 3000;
const mysql = require("mysql2");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot", // パスワードについては、mysqlを立ち上げた時に設定したpassにしましょう。特にこだわりない人はrootrootとしましょう。
  database: "expressdb",
});

app.use(express.static("assets"));

app.get("/", (req, res) => {
  const sql = "select * from users";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", { users: result }); // res.send(result);から変更
  });
});
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'html/form.html'))
});
app.post("/", (req, res) => {
  const sql = "INSERT INTO users SET ?";
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});
app.get("/delete/:id", (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});
app.post("/update/:id", (req, res) => {
  const sql = "UPDATE users SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});
app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", { user: result });
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
