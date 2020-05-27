const express = require('express');
const HomeController = require('../controllers/HomeControllers')
const UserController = require('../controllers/UserControllers') 
const PostController = require('../controllers/PostController')
const ImageMiddleware = require('../Middlewares/imageMiddleware')
const AuthMiddleware = require('../Middlewares/authMiddleware')

const router = express.Router();



router.get('/',  HomeController.index) 
router.get('/users/login', UserController.login)
router.post('/users/login', UserController.loginAction)

router.get('/users/register', UserController.register)
router.post('/users/register', UserController.registerAction)

router.get('/post/add', AuthMiddleware.isLogged, PostController.add)
router.post('/post/add',
            AuthMiddleware.isLogged,
            ImageMiddleware.upload,
            ImageMiddleware.resize,
            PostController.addAction
)

router.get('/post/:slug/edit', AuthMiddleware.isLogged, PostController.edit)
router.post('/post/:slug/edit', 
    AuthMiddleware.isLogged,
    ImageMiddleware.upload,
    ImageMiddleware.resize,
    PostController.editAction)

router.get('/post/:slug', PostController.view)

router.get('/users/logout', UserController.logout)

router.get('/users/profile', AuthMiddleware.isLogged, UserController.profile)
router.post('/users/profile', AuthMiddleware.isLogged, UserController.profileAction)

router.post('/users/change-password', AuthMiddleware.isLogged, AuthMiddleware.changePass)

module.exports = router; 