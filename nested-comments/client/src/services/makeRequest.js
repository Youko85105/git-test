import axios from "axios"

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
})

export function makeRequest(url, options = {}) {
  if (options.method === "DELETE" && options.data) {
    return api.delete(url, { data: options.data })
      .then(res => res.data)
      .catch(error => {
        const errorMessage = error?.response?.data?.message || 
                           error?.message || 
                           "Failed to delete. Please try again."
        return Promise.reject(errorMessage)
      })
  }

  return api(url, options)
    .then(res => res.data)
    .catch(error => {
      const errorMessage = error?.response?.data?.message || 
                         error?.message || 
                         "Request failed. Please check your connection and try again."
      return Promise.reject(errorMessage)
    })
}
