const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(morgan(':method :url - Status: :status - :response-time ms'));

const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']);
app.use(cors({
	origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://127.0.0.1:5176'],
	credentials: true,
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