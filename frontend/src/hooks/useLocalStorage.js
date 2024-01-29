import { useState, useEffect } from "react";

/**
 * Custom Hook to save user info like token and username into localStorage
 * 
 * Creates a user state and looks in localStorage for current user info, if cannot find it, assign null
 * When user info updates, useEffect either cleans it or updates localStorage
 * 
 * Retunrs [user, setUser]
 */

const useLocalStorage = (localStorageKey, initialValue = null) => {
    let initialUserValue
    if(localStorage.getItem(localStorageKey)) {
        try {
            initialUserValue = JSON.parse(localStorage.getItem(localStorageKey))
        } catch (e) {
            console.error("useLocalStorage custom hook: problem loading localStorage data", e);
        }
    } else {
        initialUserValue = initialValue
    }

    const [user, setUser] = useState(initialUserValue)

    useEffect(() => {
        if(user === null) {
            localStorage.removeItem(localStorageKey)
        } else {
            localStorage.setItem(localStorageKey, JSON.stringify(user))
        }
    }, [localStorageKey, user])

    return [user, setUser]
}

export default useLocalStorage;