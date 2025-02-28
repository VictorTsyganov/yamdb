/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from 'react'
import api from '../api'

const GenCatContext = createContext({
    genres: [],
    genresForm: [],
    categories: [],
    categoriesForm: [],
    loading: false,
})

export function GenCatContextProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [genres, setGenres] = useState([])
    const [genresForm, setGenresForm] = useState([])
    const [categories, setCategories] = useState([])
    const [categoriesForm, setCategoriesForm] = useState([])

    useEffect(() => {
        async function preloadGenres() {
            api.getGenres().then(response => {
                setLoading(true)
                if(response) {
                    setGenres(response.data)
                    setGenresForm(response.data.map((value) => {
                        return{
                            label: value.name,
                            value: value.slug
                        }
                    }))
                }
                setLoading(false)
            })
        }
        async function preloadCategories() {
            api.getCategories().then(response => {
                setLoading(false)
                if(response) {
                    setCategories(response.data)
                    setCategoriesForm(response.data.map((value) => {
                        return{
                            label: value.name,
                            value: value.slug
                        }
                    }))
                }
                setLoading(false)
            })
        }
        preloadGenres()
        preloadCategories()
    }, [])

    return <GenCatContext.Provider value={{ loading, genres, categories, genresForm, categoriesForm }}>
        {children}
    </GenCatContext.Provider> 
}
export function useGenCatContext() {
    return useContext(GenCatContext)
}

