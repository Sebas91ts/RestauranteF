import axios from 'axios'
import Cookies from 'js-cookie'

const instancia = axios.create({
  baseURL: 'https://restauranteb.onrender.com'
})

// ✅ Interceptor para agregar token en cada request
instancia.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instancia
