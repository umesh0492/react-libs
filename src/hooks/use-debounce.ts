import { useEffect, useState } from "react"

/**
 * useDebounce — delays updating a value until after a specified delay.
 * Use for search inputs to avoid firing a request on every keystroke.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 400ms)
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 400)
 * useEffect(() => { fetchResults(debouncedSearch) }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
