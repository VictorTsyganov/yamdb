/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import {createContext, useContext, useState} from 'react'

const LoggedContext = createContext({
    loggedIn: false,
    userName: null
})

export default function AuthContextProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(!!sessionStorage.getItem('token'))
    const [userName, setUserName] = useState(sessionStorage.getItem('username')? sessionStorage.getItem('username') : null)

    function changeLoggedIn(value) {
        setLoggedIn(value)
    }

    return <LoggedContext.Provider value={{loggedIn, userName, changeLoggedIn, setUserName}}>
        {children}
    </LoggedContext.Provider>
}

export function useAuthContext() {
    return useContext(LoggedContext)
}