import axios from 'axios'

export const axiosClient  = axios.create({
    baseURL: "http://localhost:5000/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})


export const axiosClientWithoutAuth = axios.create({
    baseURL: "http://localhost:5000/",
    headers: {
        "Content-Type": "application/json",
    }
})