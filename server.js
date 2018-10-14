const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const PORT =  process.env.PORT || 5000;

// Server middleware
// app.use()
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
})
app.get('/about', (req, res) => {
    res.send('about page');
})
app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
})