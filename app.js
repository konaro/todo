const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const dotenv = require('dotenv')

const routes = require('./routes')

const errorHandler = require('./middlewares/error-handler')
const messageHandler = require('./middlewares/flash-message-handler')

const port = 3000

dotenv.config()

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}))

app.use(flash())
app.use(messageHandler)

app.use(routes)

app.use(errorHandler)

app.listen(port, () => {
	console.log(`App is running on http://localhost:${port}`)
})