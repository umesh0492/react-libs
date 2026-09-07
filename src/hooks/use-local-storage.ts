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
        setStoredValue((prev) => {
          const newValue =
            typeof value === "function" ? (value as (prev: T) => T)(prev) : value
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(key, JSON.stringify(newValue))
              window.dispatchEvent(new Event("local-storage"))
            } catch (err) {
              console.warn(`useLocalStorage: could not persist "${key}"`, err)
            }
          }
          return newValue
        })
      } catch (err) {
        console.warn(`useLocalStorage: could not set "${key}"`, err)
      }
    },
    [key]
  )

  // Sync across tabs & within-window events
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
