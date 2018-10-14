const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Instantiate express app
const app = express();

//Body Parser middleware setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connect to mongoose
mongoose.Promise = global.Promise;

mongoose
  .connect(
    'mongodb://localhost/ideajot-dev',
    { useMongoClient: true }
  )
  .then(() => {
    console.log('mongoDB connected');
  })
  .catch(err => {
    console.log('trouble connected mongoDB');
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
  if(!req.body.title) {
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.description) {
    errors.push({text: 'Please add some description'});
  }
  if(errors.length>0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      description: req.body.description
    });
  } else {
    res.send('passed');
  }
});

//Add Idea Route
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
