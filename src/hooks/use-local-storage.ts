"use client";

import { useState, useCallback, useEffect, useRef } from "react"

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
  const initialValueRef = useRef<T>(initialValue)
  useEffect(() => {
    initialValueRef.current = initialValue
  }, [initialValue])

  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValueRef.current
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValueRef.current
    } catch {
      return initialValueRef.current
    }
  }, [key])

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })
  const storedValueRef = useRef<T>(storedValue)

  useEffect(() => {
    storedValueRef.current = storedValue
  }, [storedValue])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const current = typeof window === "undefined" ? storedValueRef.current : readValue()
        const newValue =
          typeof value === "function" ? (value as (prev: T) => T)(current) : value

        setStoredValue(newValue)
        storedValueRef.current = newValue

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(newValue))
            window.dispatchEvent(new Event("local-storage"))
          } catch (err) {
            console.warn(`useLocalStorage: could not persist "${key}"`, err)
          }
        }
      } catch (err) {
        console.warn(`useLocalStorage: could not set "${key}"`, err)
      }
    },
    [key, readValue]
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
