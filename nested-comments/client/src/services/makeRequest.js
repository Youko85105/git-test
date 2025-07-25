import axios from "axios"

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
})

export function makeRequest(url, options = {}) {
  if (options.method === "DELETE" && options.data) {
    return api.delete(url, { data: options.data })
      .then(res => res.data)
      .catch(error => Promise.reject(error?.response?.data?.message ?? "im that mfking Error"))
  }

  return api(url, options)
    .then(res => res.data)
    .catch(error => Promise.reject(error?.response?.data?.message ?? "im that mfking Error"))
}
