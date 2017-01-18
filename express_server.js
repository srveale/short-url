const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')


var PORT = process.env.PORT || 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls/`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
                       username: req.cookies["username"]
                      }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  urlDatabase[generateRandomString()] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect('/urls')
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       urls: urlDatabase,
                       username: req.cookies["username"]
                     };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  console.log(req.body);
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect(`/urls/${req.params.id}`);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/u/:shortURL", (req, res) => {
  if (req.params.shortURL == 'undefined'){
    throw "don't do that";
  }
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  console.log(req.body.username);
  res.redirect('/');
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/')
});



function generateRandomString() {
  //http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}