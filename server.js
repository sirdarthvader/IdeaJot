const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Instantiate express app
const app = express();

//Body Parser middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to mongoose
mongoose.Promise = global.Promise;

mongoose
  .connect(
    'mongodb://ashish:db1234@ds133353.mlab.com:33353/ideajot',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('mongoDB connected');
  })
  .catch(err => {
    console.log('trouble connecting mongoDB');
  });

//Load Mongoose model
require('./models/Idea');
const Idea = mongoose.model('idea');

// Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
  })
);
app.set('view engine', 'handlebars');

//Method overRide middleware
app.use(methodOverride('_method'));

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('home', {
    title: title,
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

//Process Form
app.post('/ideas', (req, res) => {
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
    new Idea(newIdea).save().then(idea => {
      res.redirect('/ideas');
    });
  }
});

//Show ideas Route
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas,
      });
    });
});

//Add Idea Route
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Edit Idea
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then(idea => {
    res.render('ideas/edit', {
      idea: idea,
    });
  });
});

//Edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({ id: req.body.id }).then(idea => {
    //mutate with new values
    idea.title = req.body.title;
    idea.description = req.body.description;

    idea.save().then(idea => {
      res.redirect('/ideas');
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
