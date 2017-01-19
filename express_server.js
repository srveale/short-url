const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const methodOverride = require('method-override')

var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'))

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const urlDatabase = {
  "general": {"b2xVn2": "http://www.lighthouselabs.ca",
               "9sm5xK": "http://www.google.com"
             },
  "i5Nk4a":  {"b2xVn3": "http://www.lighthouselabs.ca",
               "9sm5x9": "http://www.google.com"
             }
};

const users = {};

app.get("/", (req, res) => {
  let user_id = req.session.user_id;
  if (user_id in users) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }

});

app.delete("/urls/:id/delete", (req, res) => {
  let user_id = req.session.user_id;
  if (req.params.id in urlDatabase[user_id]){
    delete urlDatabase[user_id][req.params.id];
    res.redirect(`/urls/`);
  } else {
    res.status(403);
    res.send("You don't have access to that code, or it doesn't exist");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user_id: req.session.user_id,
                       users: users
                     }
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
                       user_id: req.session.user_id,
                       users: users
                     }
  res.render("urls_index", templateVars);
});

app.put("/urls", (req, res) => {
  let user_id = req.session.user_id;
  if (user_id in users){

    urlDatabase[user_id][generateRandomString()] =  req.body.longURL;
    res.redirect('/urls');

  } else {
    res.status(403);
    res.send('You need to be logged in to do that.');
  }
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       urls: urlDatabase,
                       user_id: req.session.user_id,
                       users: users
                     };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  let user_id = req.session.user_id;
  if (req.params.id in urlDatabase[user_id]){
    urlDatabase[user_id][req.params.id] = req.body.newURL;
    res.redirect(`/urls/${req.params.id}`);
  } else {
    res.status(403);
    res.send("You don't have access to that code, or it doesn't exist")
  }
});

app.get("/u/:shortURL", (req, res) => {
  for (let user in urlDatabase) {

    if (req.params.shortURL in urlDatabase[user]) {
      let longURL = urlDatabase[user][req.params.shortURL];
      res.redirect(longURL);
    }

  }
});

app.post("/login", (req, res) => {
  let user_exists = false;
  let password_good = false;
  let user_id = '';

  for (user in users){
    if (users[user].email == req.body.email) {
      user_id = users[user].id;
      user_exists = true;
      if (bcrypt.compareSync(req.body.password, users[user_id].password)){
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

  req.session.user_id = user_id;
  res.redirect('/');
});

app.get("/login", (req, res) => {
  let templateVars = { user_id: req.session.user_id,
                       users: users
                     }
  res.render("login", templateVars);
});

app.delete("/logout", (req, res) => {
  req.session = null;
  res.redirect('/')
});

app.get("/register", (req, res) => {
  let templateVars = { user_id: req.session.user_id,
                       users: users
                     }
  res.render("register", templateVars);
})

app.put('/register', (req, res) => {
  let user_id = generateRandomString();

  for (user in users) {
    if (req.body.email in users[user]) {
      res.status(400);
      res.send('User email already registered.');
    }
  }

  if (!req.body.email || !req.body.password){
    res.status(400);
    res.send('Please fill in both email and password.');
  }

  users[user_id] = {
    "id": user_id,
    "email": req.body.email,
    "password": bcrypt.hashSync(req.body.password, 10)
  };

  urlDatabase[user_id] = {};

  req.session.user_id = user_id;
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