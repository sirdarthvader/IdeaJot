const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Load Mongoose model
require('../models/Idea');
const Idea = mongoose.model('idea');

//Process Form
router.post('/', (req, res) => {
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
    };
    new Idea(newIdea)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Idea added successfully')
        res.redirect('/ideas');
      })
      .catch(err => {
        console.log({ msg: err });
      });
  }
});

//Show ideas Route
router.get('/', (req, res) => {
  Idea.find({})
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
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

//Edit Idea
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  })
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea,
      });
    })
    .catch(err => {
      console.log({
        msg: err,
      });
    });
});

//Edit form process
router.put('/:id', (req, res) => {
  Idea.findOne({ id: req.body.id })
    .then(idea => {
      //mutate with new values
      idea.title = req.body.title;
      idea.description = req.body.description;

      idea
        .save()
        .then(idea => {
          req.flash('success_msg', 'Idea edited successfully')
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
router.delete('/:id', (req, res) => {
  Idea.remove({
    _id: req.params.id,
  }).then(() => {
    req.flash('success_msg', 'Idea deleted successfully')
    res.redirect('/ideas');
  });
  // res.send('deleted');
});

module.exports = router;