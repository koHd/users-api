var User = require('../models/user');
var express = require('express');
var router = express.Router();


// POST /users/:id
// Creat a user
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
      return res.status(404).end();
    }

    if (req.body.password === user.sha1) {
      res.json(user);
    } else {
      return res.status(500).json({
        error: "Username and password not correct"
      });
    }

  })
})

module.exports = router;
