import { useCallback, useEffect, useState } from "react"

export function useAsync(func, dependencies = []) {
  const { execute, ...state } = useAsyncInternal(func, dependencies, true)

  useEffect(() => {
  execute()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
  return state
}

export function useAsyncFn(func, dependencies = []) {
  return useAsyncInternal(func, dependencies, false)
}

function useAsyncInternal(func, dependencies, initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState()
  const [value, setValue] = useState()

  const execute = useCallback((...params) => {
    setLoading(true)
    return func(...params)
      .then(data => {
        setValue(data)
        setError(undefined)
        return data
      })
      .catch(error => {
        // Convert error to string to prevent React rendering issues
        const errorMessage = error instanceof Error ? error.message : 
                           typeof error === 'string' ? error : 
                           'An unknown error occurred'
        setError(errorMessage)
        setValue(undefined)
        return Promise.reject(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, dependencies) // ← remove spreading func + dependencies

  return { loading, error, value, execute }
}