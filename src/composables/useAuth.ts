import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

// Configure Axios base URL
axios.defaults.baseURL = 'http://localhost:8000/api'

// Define User interface
export interface User {
    name: string
    email?: string
    [key: string]: any
}

// Define auth state
const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Token management
const TOKEN_COOKIE_NAME = 'auth_token'

const setToken = (token: string) => {
    Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 7 }) // Token expires in 7 days
}

const getToken = () => {
    return Cookies.get(TOKEN_COOKIE_NAME)
}

const removeToken = () => {
    Cookies.remove(TOKEN_COOKIE_NAME)
}

// Set up axios interceptor for authentication
axios.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export function useAuth() {
    const router = useRouter()

    const login = async (credentials: { email: string; password: string; remember: boolean }) => {
        try {
            loading.value = true
            error.value = null

            const response = await axios.post('/login', credentials)
            const { token, user: userData } = response.data

            setToken(token)
            user.value = userData

            return userData
        } catch (err: any) {
            error.value = err.response?.data?.error || 'An error occurred during login'
            throw err
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        try {
            loading.value = true
            error.value = null

            await axios.post('/logout')
            removeToken()
            user.value = null

            router.push('/login')
        } catch (err: any) {
            error.value = err.response?.data?.message || 'An error occurred during logout'
            throw err
        } finally {
            loading.value = false
        }
    }

    const check = async () => {
        try {
            const token = getToken()
            if (!token) return false

            const response = await axios.get('/user')
            user.value = response.data
            return true
        } catch (err) {
            removeToken()
            user.value = null
            return false
        }
    }

    const register = async (userData: {
        name: string
        email: string
        password: string
        password_confirmation: string
    }) => {
        try {
            loading.value = true
            error.value = null

            const response = await axios.post('/register', userData)
            const { token, user: newUser } = response.data

            setToken(token)
            user.value = newUser

            return newUser
        } catch (err: any) {
            error.value = err.response?.data?.message || 'An error occurred during registration'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        user,
        loading,
        error,
        login,
        logout,
        check,
        register,
    }
}
