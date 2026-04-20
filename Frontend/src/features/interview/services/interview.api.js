import axios from "axios"

const apiBaseURL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:3000' : 'https://prepdost.onrender.com');

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true
})

// Request interceptor to attach the auth token to every interview api request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export async function generateInterviewReport({ resume, selfDeclaration, jobDescription }) {
    try {
        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('selfDeclaration', selfDeclaration);
        formData.append('jobDescription', jobDescription);

        const response = await api.post('/api/interview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error generating interview report:', error);
        throw error;
    }
}


export async function getInterviewReportById(interviewId) {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching interview report:', error);
        throw error;
    }
}

export async function getAllInterviewReports() {
    try {
        const response = await api.get('/api/interview');
        return response.data;
    } catch (error) {
        console.error('Error fetching interview reports:', error);
        throw error;
    }
}

