const router = require('express').Router()
const controller = require('./controller')

router.post('/register', controller.register)
router.get('/register', controller.test)

//router.post('/login', controller.login)
router.get('/login', controller.login_test)

router.get('/check', controller.check)

module.exports = router