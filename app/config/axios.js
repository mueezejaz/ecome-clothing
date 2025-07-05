import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.100.8:3000", 
  timeout: 20000,
});

export default axiosInstance;
