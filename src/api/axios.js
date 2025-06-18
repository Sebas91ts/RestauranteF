import axios from "axios";

const instancia = axios.create({
  baseURL:'https://restauranteb.onrender.com',
  withCredentials: true
})

export default instancia
