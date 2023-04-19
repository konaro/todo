const express = require('express')
const router = express.Router()

const todos = require('./modules/todos')

router.use('/todos', todos)

module.exports = router