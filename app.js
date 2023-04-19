const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const db = require('./models')
const Todo = db.Todo

const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
	secret: 'ThisIsSecret',
	resave: false,
	saveUninitialized: true
}))
app.use(flash())

app.get('/', (req, res) => {
	res.render('index')
})

app.get('/todos', (req, res) => {
	return Todo.findAll({
		attributes: ['id', 'name', 'isComplete'],
		raw: true
	})
		.then((todos) => res.render('todos', { todos, message: req.flash('success'), error: req.flash('error') }))
		.catch((err) => {
			console.log(err)
			req.flash('error', '處理失敗')
			res.redirect('back')
		})
})

app.get('/todos/new', (req, res) => {
	return res.render('new')
})

app.post('/todos', (req, res) => {
	const name = req.body.name
	
	return Todo.create({ name })
		.then(() => {
			req.flash('success', '建立成功!')
			res.redirect('/todos')
		})
		.catch((err) => {
			console.log(err)
			req.flash('error', '處理失敗')
			res.redirect('back')
		})
})

app.get('/todos/:id', (req, res) => {
	const id = req.params.id

	return Todo.findByPk(id, {
		attributes: ['id', 'name', 'isComplete'],
		raw: true
	})
		.then((todo) => res.render('todo', { todo, message: req.flash('success'), error: req.flash('error') }))
		.catch((err) => {
			console.log(err)
			req.flash('error', '處理失敗')
			res.redirect('back')
		})
})

app.get('/todos/:id/edit', (req, res) => {
	const id = req.params.id

	return Todo.findByPk(id, {
		attributes: ['id', 'name', 'isComplete'],
		raw: true
	})
		.then((todo) => res.render('edit', { todo, error: req.flash('error') }))
		.catch((err) => {
			console.log(err)
			req.flash('error', '處理失敗')
			res.redirect('back')
		})
})

app.put('/todos/:id', (req, res) => {
	const id = req.params.id
	const { name, isComplete } = req.body

	return Todo.update({
		name,
		isComplete: isComplete === 'completed',
		completeAt: isComplete === 'completed' ? new Date() : null
	}, { where: { id } })
		.then(()=> {
			req.flash('success', '更新成功!')
			res.redirect(`/todos/${id}`)
		})
		.catch((err) => {
			console.log(err)
			req.flash('error', '處理失敗')
			res.redirect('back')
		})
})

app.delete('/todos/:id', (req, res) => {
	const id = req.params.id

	return Todo.destroy({ where: { id } })
		.then(() => {
			req.flash('success', '刪除成功!')
			res.redirect('/todos')
		})
		.catch((err) => {
			console.log(err)
			req.flash('error', '處理失敗')
			res.redirect('back')
		})
})

app.listen(port, () => {
	console.log(`App is running on http://localhost:${port}`)
})