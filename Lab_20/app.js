const express = require('express');
const cargoRouter = require('./routes/cargoRouter');
const transportRouter = require('./routes/transportRouter');
const transportationRouter = require('./routes/transportationRouter');
const clientRouter = require('./routes/clientRouter');
const driverRouter = require('./routes/driverRouter');

const app = express();

const hbs = require('express-handlebars').create({
    extname: '.hbs',
    defaultLayout: 'index',
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`
})


app.engine('hbs', hbs.engine);

app.set("view engine", "hbs");

app.set("views", [`${__dirname}/views/`, `${__dirname}/views/cargoPages/`, `${__dirname}/views/clientPages/`, `${__dirname}/views/transportPages/`, `${__dirname}/views/transportationPages/`, `${__dirname}/views/driverPages/`]);

app.use(express.json());
app.use('/cargo', cargoRouter);

app.use('/client', clientRouter);
app.use('/transport', transportRouter);
app.use('/transportation', transportationRouter);
app.use('/driver', driverRouter);

app.use('/', (_, response) => {
    response.render('homePage');
})

app.listen(3000);