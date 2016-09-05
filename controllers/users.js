var User = require('../models/user');
var express = require('express');
const crypto = require('crypto');
var router = express.Router();


// POST /users/:id
// Create a user
router.post('/', function(req, res) {
  User.create(req.body, function (err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error creating user: " + err
      });
    }

    res.json(user);
  });
});

// GET /users
// Get a list of users
router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({
        error: "Error listing users: " + err
      });
    }

    res.json(users);
  });
});

// GET /users/:id
// Get a user by ID
router.get('/:id', function(req, res) {
  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
});

// PUT /users/:id
// Update a user by ID
router.put('/:id', function(req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    {$set:
      req.body
    }, {new: true}, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
});

// DELETE /users/:id
// Delete a user by ID
router.delete('/:id', function(req, res) {
  User.remove({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error deleting user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.send('User ' + req.params.id + ' deleted');
  });
});

// POST /users/login/
// Try to log in a user
router.post('/login/', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).json({
        error: "No user matches the username"
      });
    }

    const hash = crypto.createHash('sha1');
    // using sha1 as the sha256 held in database for all users is wrong
    hash.update(req.body.password+user.salt);


    if (hash.digest('hex') === user.sha1) {
      res.json(user);
    } else {
      return res.status(401).json({
        error: "Incorrect password"
      });
    }

  })
})

module.exports = router;
