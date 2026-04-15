const { Router } =require("express")
const authcontroller = require("../controllers/auth.controllers")
const { authMiddleware } = require("../middlewares/auth.middleware")


const authrouter = Router();



/* 
@route POST /api/auth/register
@desc Register a new user
@access Public
*/

authrouter.post('/register', authcontroller.registerUserController);

/* 
@route POST /api/auth/login
@desc login user with email and password
@access Public
*/

authrouter.post('/login', authcontroller.loginUserController);

/* 
@route GET /api/auth/logout
@desc logout user by blacklisting the token
@access Public
*/
authrouter.get('/logout', authcontroller.logoutUserController);

/* 
@route GET /api/auth/get-me
@desc get the details of the logged in user
@access Private
*/
authrouter.get('/get-me', authMiddleware, authcontroller.getMeController);



module.exports = authrouter;