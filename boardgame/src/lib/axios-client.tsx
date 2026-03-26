import axios from 'axios'

export const axiosClient  = axios.create({
    baseURL: "",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})


export const axiosClientWithoutAuth = axios.create({
    baseURL: "",
    headers: {
        "Content-Type": "application/json",
    }
})