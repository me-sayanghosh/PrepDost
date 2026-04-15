const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Technical question is required'],
    },
    intension: {
        type: String,
        required: [true, 'Intension is required'],
    },
    answer: {
        type:String,
        required: [true, 'Answer is required'],
    }
},{
    _id: false
})


const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Behavioral question is required'],
    },
    intension: {
        type: String,
        required: [true, 'Intension is required'],
    },
    answer: {
        type:String,
        required: [true, 'Answer is required'],
    }
}, {
    _id: false
})



const skillAssessmentSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Skill is required'],
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: [true, 'Severity is required'],
    },
}, {
    _id: false
})


const preparationStrategySchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, 'Day is required'],
    },
    focus: {
        type: String,
        required: [true, 'Focus is required'],
    },
    task: {
        type: String,
        required: [true, 'Task is required'],
    },
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, 'Job description is required'],
    },
    resume: {
        type: String,
    },
    selfDeclaration: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillAssessments: [skillAssessmentSchema],
    preparationStrategy: [preparationStrategySchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Job title is required'],
    }
}, {
    timestamps: true,
});

const InterviewReport = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReport; 