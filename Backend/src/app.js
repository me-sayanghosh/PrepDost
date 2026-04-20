const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(morgan(':method :url - Status: :status - :response-time ms'));

const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const allowedOrigins = [
	"https://prep-dost.vercel.app",
	"http://localhost:5173",
	"http://localhost:5174",
	...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean) : []),
];

app.use(cors({
	origin: allowedOrigins,
	credentials: true,
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* require all the routes here */
const authrouter = require('./routes/auth.route');
const interviewRouter = require('./routes/interview.route');


/* using all the routes here */
app.use('/api/auth', authrouter);
app.use('/api/interview', interviewRouter);




module.exports = app;