const express = require('express');
const app = express();
const PORT =  process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('root route');
})
app.get('/about', (req, res) => {
    res.send('about page');
})
app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
})