import { useState, useCallback, useEffect } from "react"

/**
 * useLocalStorage — typed localStorage state that syncs across tabs.
 *
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 *
 * @example
 * const [theme, setTheme] = useLocalStorage("theme", "light")
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const newValue =
          typeof value === "function" ? (value as (prev: T) => T)(storedValue) : value
        window.localStorage.setItem(key, JSON.stringify(newValue))
        setStoredValue(newValue)
        window.dispatchEvent(new Event("local-storage"))
      } catch {
        console.warn(`useLocalStorage: could not set "${key}"`)
      }
    },
    [key, storedValue]
  )

  // Sync across tabs
  useEffect(() => {
    const handler = () => setStoredValue(readValue())
    window.addEventListener("storage", handler)
    window.addEventListener("local-storage", handler)
    return () => {
      window.removeEventListener("storage", handler)
      window.removeEventListener("local-storage", handler)
    }
  }, [readValue])

  return [storedValue, setValue] as const
}
