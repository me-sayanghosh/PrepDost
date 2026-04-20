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
@route POST /api/auth/forgot-password
@desc send password reset verification code to email
@access Public
*/
authrouter.post('/forgot-password', authcontroller.forgotPasswordController);

/* 
@route POST /api/auth/reset-password
@desc reset password with email verification code
@access Public
*/
authrouter.post('/reset-password', authcontroller.resetPasswordController);

/* 
@route GET /api/auth/get-me
@desc get the details of the logged in user
@access Private
*/
authrouter.get('/get-me', authMiddleware, authcontroller.getMeController);



module.exports = authrouter;