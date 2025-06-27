import axios from "axios";


const axiosInstance = axios.create({
  baseURL: '',
  timeout: 20000,
})

export default axiosInstance;