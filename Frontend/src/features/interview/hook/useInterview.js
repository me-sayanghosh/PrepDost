import {generateInterviewReport, getAllInterviewReports, getInterviewReportById} from "../services/interview.api"; 

import { useContext } from "react";

import {InterviewContext} from "../interview.context.jsx";



export const useInterview = () => {

    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const {interviewReport, setInterviewReport, loading, setLoading, reports, setReports} = context;

    const handleGenerateReport = async ({ resume, selfDeclaration, jobDescription }) => {   
        setLoading(true);
        try {
            const data = await generateInterviewReport({ resume, selfDeclaration, jobDescription });
            setInterviewReport(data);
            return data;
        } catch (error) {
            console.error("Failed to generate interview report:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleGetAllReports = async () => {   
        setLoading(true);
        try {
            const data = await getAllInterviewReports();
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch interview reports:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleGetReportById = async (interviewId) => {
        setLoading(true);
        try {
            const data = await getInterviewReportById(interviewId);
            setInterviewReport(data);
        }

        catch (error) {
            console.error("Failed to fetch interview report:", error);
        } finally {
            setLoading(false);
        }       
    }

    return {
        interviewReport,
        loading,
        reports,
        handleGenerateReport,
        handleGetAllReports,
        handleGetReportById
    }

}

