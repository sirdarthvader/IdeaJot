const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/login', (req, res) => {
  res.send('login');
})


router.get('/register', (req, res) => {
  res.send('register');
})

module.exports = router;