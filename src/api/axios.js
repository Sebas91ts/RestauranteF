import axios from "axios";

const instancia = axios.create({
  baseURL:'https://restaurante-jbe5.onrender.com',
  withCredentials: true
})

export default instancia
