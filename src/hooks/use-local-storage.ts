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
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(readValue())
      }
    }
    const handleLocalStorage = () => {
      setStoredValue(readValue())
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("local-storage", handleLocalStorage)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("local-storage", handleLocalStorage)
    }
  }, [key, readValue])

  return [storedValue, setValue] as const
}
