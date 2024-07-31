// src/api/axiosInstance.ts
import axios from 'axios';
 
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/contacts/', // Replace with your actual backend URL(mybackend)
  headers: {
    'Content-Type': 'application/json',
   
  },
});
 
export default axiosInstance;