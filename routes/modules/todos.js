const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

router.get('/', (req, res) => {
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

router.get('/new', (req, res) => {
	return res.render('new')
})

router.post('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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

router.get('/:id/edit', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router