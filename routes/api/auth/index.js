const router = require('express').Router()
const controller = require('./controller')
const authMiddleware = require('../../../middlewares/auth')

router.post('/register', controller.register)
router.get('/register', controller.test)

//router.post('/login', controller.login)
router.get('/login', controller.login_test)

router.use('/check', authMiddleware)
router.get('/check', controller.check)

module.exports = router