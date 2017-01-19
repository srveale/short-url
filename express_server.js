const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')


var PORT = process.env.PORT || 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

app.get("/", (req, res) => {
  res.end("hello");
  // let templateVars = { user_id: req.cookies.user_id,
  //                      users: users
  //                    }
  // res.render('urls_index', templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls/`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls/new", (req, res) => {
  let templateVars = { user_id: req.cookies.user_id,
                       users: users
                     }
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
                       user_id: req.cookies.user_id,
                       users: users
                     }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (req.cookies['user_id'] in users){
    urlDatabase[generateRandomString()] = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send('You need to be logged in to do that.');
  }
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       urls: urlDatabase,
                       user_id: req.cookies["user_id"],
                       users: users
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

app.get("/u/:shortURL", (req, res) => {
  if (req.params.shortURL == 'undefined'){
    throw "don't do that";
  }
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/login", (req, res) => {
  let user_exists = false;
  let password_good = false;
  let user_id = '';
  for (user in users){


    if (users[user].email == req.body.email) {
      user_id = users[user].id;
      user_exists = true;
      if (req.body.password == users[user_id].password){
        password_good = true;
      }
    }
  }

  if (!user_exists) {
    res.status(403);
    res.send("Email not registered");
  }

  if (!password_good) {
    res.status(403);
    res.send("Incorrect Password");
  }

  console.log('user_exists', user_exists);
  console.log('password_good', password_good);
  console.log('user_id', user_id);

  console.log
  res.cookie('user_id', user_id);
  res.redirect('/');
});

app.get("/login", (req, res) => {
  let templateVars = { user_id: req.cookies.user_id,
                       users: users
                     }
  res.render("login", templateVars);
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/')
});

app.get("/register", (req, res) => {
  let templateVars = { user_id: req.cookies.user_id,
                       users: users
                     }
  res.render("register", templateVars);
})

app.post('/register', (req, res) => {
  let id = generateRandomString();
  console.log(users);
  for (user in users) {
    if (req.body.email in user) {
      res.status(400);
      res.send('User email already registered.');
    }
  }
  if (!req.body.email || !req.body.password){
    res.status(400);
    res.send('Please fill in both email and password.');
  }
  users[id] = {
    "id": id,
    "email": req.body.email,
    "password": req.body.password
  };
  res.cookie('user_id', id);
  res.redirect('/');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



function generateRandomString() {
  //http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}