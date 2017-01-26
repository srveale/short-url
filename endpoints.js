module.exports.getIndex = function (res, req){
 let user_id = req.session.user_id;
  if (user_id in users) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
};

module.exports.deleteURL = function (req, res) {
  let user_id = req.session.user_id;
  if (req.params.id in urlDatabase[user_id]){
    delete urlDatabase[user_id][req.params.id];
    res.redirect(`/urls/`);
  } else {
    res.status(403);
    res.send("You don't have access to that code, or it doesn't exist");
  }
};

module.exports.getUrlsJson = function (req, res) {
  res.json(urlDatabase);
};

module.exports.getNew = function (req, res) {
  let templateVars = { user_id: req.session.user_id,
                       users: users
                     };

  res.render("urls_new", templateVars);
};

module.exports.getURLS = function (req, res) {
  let user_id = req.session.user_id;
  let uniqueVisits = Object.keys(visits).length;

  let templateVars = { urls: urlDatabase,
                       user_id: user_id,
                       users: users,
                       creationDates: creationDates,
                       visitCounts: visitCounts,
                       uniqueVisits: uniqueVisits
                     };

  console.log(user_id);
  if (!user_id) {
    res.render("urls_index");
    res.status(401);
  }

  res.render("urls_index", templateVars);
};

module.putURLS = function (req, res) {
  let user_id = req.session.user_id;

  if (user_id in users){

    let url_id = generateRandomString();
    urlDatabase[user_id][url_id] =  req.body.longURL;

    creationDates[url_id] = new Date();
    visitCounts[url_id] = 0;

    res.redirect('/urls');

  } else {

    res.status(403);
    res.send('You need to be logged in to do that.');

  }
};

module.exports.getEdit = function (req, res) {
  let uniqueVisits = Object.keys(visits).length;
  let shortURL = req.params.id;
  let user_id = req.session.user_id;
  let shortURL_exists = false;

  for (user in urlDatabase) {
    if (shortURL in urlDatabase[user]) {
      shortURL_exists = true;
    }
  }

  if (!user_id) {

    res.status(401);
    res.send("You need to be logged in for that.");

  } if (!(shortURL in urlDatabase[user_id])) {

    res.status(403);
    res.send("You do not have access to that URL.");

  } if (!shortURL_exists) {

    res.status(404);
    res.send("Short URL with that id does not exist.");

  }

  let templateVars = { shortURL: req.params.id,
                       urls: urlDatabase,
                       user_id: req.session.user_id,
                       users: users,
                       visitCounts: visitCounts,
                       visits: visits,
                       uniqueVisits: uniqueVisits,
                       creationDates: creationDates
                     };

  res.render("urls_show", templateVars);
};

module.exports.postEdit = function (req, res) {
  let shortURL = req.params.id;
  let user_id = req.session.user_id;
  let shortURL_exists = false;

  for (user in urlDatabase) {
    if (shortURL in urlDatabase[user]) {
      shortURL_exists = true;
    }
  }

  if (!user_id) {

    res.status(401);
    res.send("You need to be logged in for that.");

  } if (!(shortURL in urlDatabase[user_id])) {

    res.status(403);
    res.send("You do not have access to that URL.");

  } if (!shortURL_exists) {

    res.status(404);
    res.send("Short URL with that id does not exist.");

  } if (req.params.id in urlDatabase[user_id]){

    urlDatabase[user_id][shortURL] = req.body.newURL;
    res.redirect(`/urls/${shortURL}`);

  }
};

module.exports.getShortUrl = function (req, res) {
  let shortURL = req.params.shortURL;
  let shortURL_exists = false;

  for (user in urlDatabase) {
    if (shortURL in urlDatabase[user]) {
      shortURL_exists = true;
    }
  }
  if (!shortURL_exists) {
    res.status(404);
    res.send("That short URL does not exist");
  }

  if (!(shortURL in visits)) {
    visits[shortURL] = {};
  }

  for (let user in urlDatabase) {
    if (shortURL in urlDatabase[user]) {
      shortURL_exists = true;
      let visitor_id = (req.session.user_id || generateRandomString());

      if (!(visitor_id in visits[shortURL])) {
        visits[shortURL][visitor_id] = [];
      }

      req.session.visitor_id = visitor_id;
      visits[shortURL][visitor_id].push(new Date());

      visitCounts[shortURL] += 1;
      let longURL = urlDatabase[user][shortURL];
      res.redirect(longURL);

    }
  }
};

module.exports.postLogin = function (req, res) {
  let user_exists = false;
  let password_good = false;
  let user_id = '';

  for (user in users){
    if (users[user].email === req.body.email) {
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
};

module.exports.getLogin = function  (req, res) {
  let templateVars = { user_id: req.session.user_id,
                       users: users
                     };
  res.render("login", templateVars);
};

module.exports.deleteLogout = function (req, res) {
  req.session = null;
  res.redirect('/');
};

module.exports.getRegister = function (req, res) {
  let templateVars = { user_id: req.session.user_id,
                       users: users
                     }

  res.render("register", templateVars);
};

module.exports.putRegister = function (req, res) {
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
};