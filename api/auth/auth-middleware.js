const User = require("../users/users-model");

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const { username } = req.body
    const users = await User.findBy({username});

    if (users.length) {
      next({ status: 422, message: "Username taken" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username });

    if (!users.length) {
      next({ status: 401, message: "Invalid credentials" });
    } else {
      req.user = users[0]
      next();
    }
  } catch (err) {
    next(err);
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  try {
    const { password } = req.body;
    if (!password || password < 3) {
      next({ status: 422, message: "Password must be longer than 3 chars" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  checkUsernameExists,
  checkUsernameFree,
  checkPasswordLength,
  restricted,
};
