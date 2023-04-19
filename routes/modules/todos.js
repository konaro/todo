const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

const limit = 10

router.get('/', (req, res, next) => {
	const page = parseInt(req.query.page) || 1
	const offset = (page - 1) * limit

	return Todo.findAll({
		attributes: ['id', 'name', 'isComplete'],
		raw: true,
		offset,
		limit
	})
		.then((todos) => res.render('todos', {
			todos: todos,
			page,
			next: page + 1,
			prev: page > 1 ? page - 1 : page
		}))
        .catch(next)
})

router.get('/new', (req, res, next) => {
	return res.render('new')
})

router.post('/', (req, res) => {
	const name = req.body.name
	
	return Todo.create({ name })
		.then(() => {
			req.flash('success_msg', '建立成功!')
			res.redirect('/todos')
		})
        .catch(next)
})

router.get('/:id', (req, res, next) => {
	const id = req.params.id

	return Todo.findByPk(id, {
		attributes: ['id', 'name', 'isComplete'],
		raw: true
	})
		.then((todo) => res.render('todo', { todo }))
        .catch(next)
})

router.get('/:id/edit', (req, res, next) => {
	const id = req.params.id

	return Todo.findByPk(id, {
		attributes: ['id', 'name', 'isComplete'],
		raw: true
	})
		.then((todo) => res.render('edit', { todo }))
        .catch(next)
})

router.put('/:id', (req, res, next) => {
	const id = req.params.id
	const { name, isComplete } = req.body

	return Todo.update({
		name,
		isComplete: isComplete === 'completed',
		completeAt: isComplete === 'completed' ? new Date() : null
	}, { where: { id } })
		.then(()=> {
			req.flash('success_msg', '更新成功!')
			res.redirect(`/todos/${id}`)
		})
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
	const id = req.params.id

	return Todo.destroy({ where: { id } })
		.then(() => {
			req.flash('success_msg', '刪除成功!')
			res.redirect('/todos')
		})
        .catch(next)
})

module.exports = router