import axios from "axios";


const axiosInstance = axios.create({
  timeout: 20000,
})

export default axiosInstance;