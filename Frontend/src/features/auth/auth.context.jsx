import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import { getMe, loadAuthToken } from "./services/auth.api.js";



export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Load token from localStorage if it exists
                loadAuthToken();
                
                const data = await getMe()
                setUser(data.user)
            } catch (error) {
                console.log("No active session:", error.message)
                setUser(null)
            } finally {
                setLoading(false) 
            }
        }
        
        fetchUser()
       
    }, [])


    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )

}

