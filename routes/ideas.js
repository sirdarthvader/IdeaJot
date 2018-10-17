const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

//Load Mongoose model
require('../models/Idea');
const Idea = mongoose.model('idea');

//Show ideas Route
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas,
      });
    })
    .catch(err => {
      console.log({ msg: err });
    });
});

//Add Idea Route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

//Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.description) {
    errors.push({ text: 'Please add some description' });
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      description: req.body.description,
    });
  } else {
    const newIdea = {
      title: req.body.title,
      description: req.body.description,
      user: req.user.id
    };
    new Idea(newIdea)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Idea added successfully');
        res.redirect('/ideas');
      })
      .catch(err => {
        console.log({ msg: err });
      });
  }
});

//Edit Idea
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  })
    .then(idea => {
      if(idea.user != req.user.id) {
        req.flash('error_msg', 'You are not authorized');
        res.redirect('/ideas');
      } else {
        res.render('ideas/edit', {
          idea: idea,
        });
      }
    })
    .catch(err => {
      console.log({
        msg: err,
      });
    });
});

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({ id: req.body.id })
    .then(idea => {
      //mutate with new values
      idea.title = req.body.title;
      idea.description = req.body.description;
      idea
        .save()
        .then(idea => {
          req.flash('success_msg', 'Idea edited successfully');
          res.redirect('/ideas');
        })
        .catch(err => {
          console.log({ msg: err });
        });
    })
    .catch(err => {
      console.log('can not find by id...');
    });
});

//Delete idea request
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id,
  }).then(() => {
    req.flash('success_msg', 'Idea deleted successfully');
    res.redirect('/ideas');
  });
  // res.send('deleted');
});

module.exports = router;
