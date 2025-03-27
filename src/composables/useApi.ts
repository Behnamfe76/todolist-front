// src/composables/useApi.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ref, type Ref } from 'vue'
import Cookies from 'js-cookie'
import { useRouter, type Router } from 'vue-router'

// Define generic response type
interface ApiResponse<T> {
    data: T | null
    error: string | null
    loading: boolean
}

// Define config options with defaults
interface ApiConfig extends AxiosRequestConfig {
    withAuth?: boolean // Whether to include Authorization header
    redirectTo?: string // Whether to include Authorization header
}

// Create Axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

// Composable function
export function useApi<T = any>() {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)
    const data: Ref<T | null> = ref(null)
    const success: Ref<boolean> = ref(false)
    const router: Router = useRouter()

    // Generic request handler
    const request = async (
        method: 'get' | 'post' | 'put' | 'patch' | 'delete',
        url: string,
        payload?: any,
        config: ApiConfig = {},
    ): Promise<ApiResponse<R>> => {
        loading.value = true
        error.value = null
        data.value = null

        // Add Authorization header if withAuth is true and token exists
        const token = Cookies.get('auth_token')
        const headers = {
            ...config.headers,
            ...(config.withAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        }

        try {
            const response: AxiosResponse<T> = await apiClient.request({
                method,
                url,
                data: payload,
                ...config,
                headers,
            })
            data.value = response.data
            success.value = true

            if (config.redirectTo) {
                router.push(config.redirectTo)
            }

            return { data: response.data as T, error: null, loading: false }
        } catch (err: any) {
            success.value = false
            error.value = err.response?.data || 'An error occurred'
            return { data: null, error: error.value, loading: false }
        } finally {
            loading.value = false
        }
    }

    // Specific HTTP methods
    const getRequest = (url: string, config?: ApiConfig) => request('get', url, undefined, config)
    const postRequest = (url: string, payload?: any, config?: ApiConfig) =>
        request('post', url, payload, config)
    const putRequest = (url: string, payload?: any, config?: ApiConfig) =>
        request('put', url, payload, config)
    const patchRequest = (url: string, payload?: any, config?: ApiConfig) =>
        request('patch', url, payload, config)
    const deleteRequest = (url: string, config?: ApiConfig) =>
        request('delete', url, undefined, config)

    return {
        success, // Reactive success state
        data, // Reactive response data
        error, // Reactive error message
        loading, // Reactive loading state
        getRequest, // GET request
        postRequest, // POST request
        putRequest, // PUT request
        patchRequest, // PATCH request
        deleteRequest, // DELETE request
    }
}
