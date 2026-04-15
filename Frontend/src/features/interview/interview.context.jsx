import { createContext,useState  } from "react";







// eslint-disable-next-line react-refresh/only-export-components
export const InterviewContext = createContext();





export const InterviewProvider = ({ children }) => {
    const [interviewReport, setInterviewReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);
    return (
        <InterviewContext.Provider value={{ interviewReport, setInterviewReport, loading, setLoading, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    );
}