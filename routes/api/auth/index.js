const router = require('express').Router()
const controller = require('./controller')

router.post('/register', controller.register)
router.get('/register', controller.test)

module.exports = router