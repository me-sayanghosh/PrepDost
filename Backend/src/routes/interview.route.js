const express = require('express');
const { authMiddleware } = require("../middlewares/auth.middleware")
const interviewController = require('../controllers/interview.controller');
const { upload } = require('../middlewares/file.middleware');


const interviewRouter = express.Router();

/*
@route POST /api/interview/generate-report
@desc Generate an interview report based on the resume, self declaration and job description
@access Private
 */

interviewRouter.post('/generate-report', authMiddleware, upload.single('resume'), interviewController.generateInterviewReportController);

// Keep backward-compatible POST endpoint for clients using /api/interview directly.
interviewRouter.post('/', authMiddleware, upload.single('resume'), interviewController.generateInterviewReportController);

interviewRouter.get('/report/:interviewId', authMiddleware, interviewController.getInterviewReportByIdController);



interviewRouter.get('/', authMiddleware, interviewController.getAllInterviewReportByIdController);





module.exports = interviewRouter;