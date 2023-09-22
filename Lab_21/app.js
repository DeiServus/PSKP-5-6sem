const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars').create({extname: '.hbs', helpers: require('./views/helpers/deny')});
const contactRouter = require('./routes/contacts.js')();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('static'));

app.use('/', contactRouter);

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});