const pdfParse = require('pdf-parse');
const { generateInterviewReport } = require('../services/ai.services');
const interviewReportModel = require('../models/interviewReport.model');


async function generateInterviewReportController(req , res) {
    try {
        if (!req.file?.buffer) {
            return res.status(400).json({ message: 'Resume file is required' });
        }

        const options = {
            data: new Uint8Array(req.file.buffer),
            standardFontDataUrl: require('path').join(require('path').dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts') + '/'
        };
        const resumeContent = await (new pdfParse.PDFParse(options)).getText();
        const {selfDeclaration, jobDescription} = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDeclaration,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create ({
            user: req.user.id,
            resume: resumeContent.text,
            selfDeclaration,
            jobDescription,
            ...interviewReportByAi

        })

        res.status(200).json({

            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        const statusCode = [429, 503].includes(Number(error?.statusCode)) ? Number(error.statusCode) : 500;
        return res.status(statusCode).json({
            message: 'Failed to generate interview report',
            error: error?.message || 'Unknown error',
            ...(statusCode === 429 && error?.retryAfter ? { retryAfterSeconds: error.retryAfter } : {}),
        });
    }

}


async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;
    try {
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found' });
        }
        res.status(200).json({ interviewReport });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve interview report', error: error?.message || 'Unknown error' });
    }   
}

async function getAllInterviewReportByIdController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1  }).select('-resume -selfDeclaration -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationStrategy')
        res.status(200).json({
            message: "Interview reports retrieved successfully",
            interviewReports 
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve interview reports', error: error?.message || 'Unknown error' });
    }
}


module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportByIdController, };