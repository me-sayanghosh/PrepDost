import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext.js";
import { login, register, logout, getMe, setAuthToken } from "../services/auth.api.js";




export const useAuth = () => {

    const context = useContext(AuthContext)


    // 👇 Add this check
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    const { user, setUser, loading, setLoading } = context




    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data.token) {
                setAuthToken(data.token)
            }
            setUser(data.user)
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error)
            return {
                success: false,
                error: error.response?.data?.message || "Login failed",
                code: error.response?.data?.code,
            };
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data.token) {
                setAuthToken(data.token)
            }
            setUser(data.user)
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error)
            return { success: false, error: error.response?.data?.message || "Registration failed" };
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            // Clear token from localStorage and Authorization header
            setAuthToken(null)
            setUser(null)
        } catch (error) {
            console.error("Logout failed:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (error) {
                console.log("No active session", error.message)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,

    }

}