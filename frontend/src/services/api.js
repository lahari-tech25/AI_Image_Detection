import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('neuraleye_user') || 'null')
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('neuraleye_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const registerUser = (data) => api.post('/register', data)
export const loginUser = (data) => api.post('/login', data)

// Prediction
export const predictImage = (formData) =>
  api.post('/predict', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

// Admin endpoints (add more as your FastAPI grows)
export const getUsers = () => api.get('/admin/users')
export const getPredictions = () => api.get('/admin/predictions')
export const getStats = () => api.get('/admin/stats')

export default api