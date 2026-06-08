import { useContext } from "react";
import { AuthContext } from "../AuthContext.js";
import { login, googleLogin, register, logout, setAuthToken } from "../services/auth.api.js";




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
            return { success: true }
        } catch (error) {
            console.error("Logout failed:", error)
            return { success: false, error: error.response?.data?.message || "Logout failed" }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async (token) => {
        setLoading(true)
        try {
            const data = await googleLogin(token)
            if (data.token) {
                setAuthToken(data.token)
            }
            setUser(data.user)
            return { success: true };
        } catch (error) {
            console.error("Google login failed:", error)
            return {
                success: false,
                error: error.response?.data?.message || "Google login failed",
            };
        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGoogleLogin,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        googleLogin: handleGoogleLogin,
    }

}