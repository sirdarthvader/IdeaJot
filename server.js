const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Instantiate express app
const app = express();

//Body Parser middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Import routes
const ideas = require('./routes/ideas');
const user = require('./routes/user');

//Load config 
require('./config/passport')(passport);

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

// Express Session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

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

//Use routes
app.use('/ideas', ideas)
app.use('/user', user)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
