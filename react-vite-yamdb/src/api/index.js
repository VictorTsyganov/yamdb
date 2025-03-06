import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

class Api {
    constructor(url, headers) {
        this._url = url
        this._headers = headers
    }

    getTitles() {
        return axios.get(`${this._url}/api/v1/titles/`)
    }

    getTitle(id) {
        return axios.get(`${this._url}/api/v1/titles/${id}`)
    }
    createTitles(value) {
        return axios.post(`${this._url}/api/v1/titles/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    editTitles(id, value) {
        return axios.patch(`${this._url}/api/v1/titles/${id}/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    delTitles(id) {
        return axios.delete(`${this._url}/api/v1/titles/${id}/`, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    getTitlesPagination(pageNumber) {
        return axios.get(`${this._url}/api/v1/titles/?page=${pageNumber}`)
    }

    getReviews(title_id) {
        return axios.get(`${this._url}/api/v1/titles/${title_id}/reviews/`)
    }

    getReview(title_id, review_id) {
        return axios.get(`${this._url}/api/v1/titles/${title_id}/reviews/${review_id}/`)
    }

    getReviewsPagination(title_id, pageNumber) {
        return axios.get(`${this._url}/api/v1/titles/${title_id}/reviews/?page=${pageNumber}`)
    }

    createReviews(title_id, value) {
        return axios.post(`${this._url}/api/v1/titles/${title_id}/reviews/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    editReviews(title_id, review_id, value) {
        return axios.patch(`${this._url}/api/v1/titles/${title_id}/reviews/${review_id}/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    delReviews(title_id, review_id) {
        return axios.delete(`${this._url}/api/v1/titles/${title_id}/reviews/${review_id}/`, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    getCategories() {
        return axios.get(`${this._url}/api/v1/categories/`)
    }

    getGenres() {
        return axios.get(`${this._url}/api/v1/genres/`)
    }

    login(value) {
        return axios.post(`${this._url}/api/v1/auth/token/`, value)
    }

    signup(value) {
        return axios.post(`${this._url}/api/v1/auth/signup/`, value)
    }

    createGenre(value) {
        return axios.post(`${this._url}/api/v1/genres/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    delGenre(slug) {
        return axios.delete(`${this._url}/api/v1/genres/${slug}/`, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    createCategory(value) {
        return axios.post(`${this._url}/api/v1/categories/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    delCategory(slug) {
        return axios.delete(`${this._url}/api/v1/categories/${slug}/`, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    getComments(title_id, review_id) {
        return axios.get(`${this._url}/api/v1/titles/${title_id}/reviews/${review_id}/comments/`)
    }

    getComment(title_id, review_id, id) {
        return axios.get(`${this._url}/api/v1/titles/${title_id}/reviews/${review_id}/comments/${id}/`)
    }

    getCommentsPagination(title_id, review_id, pageNumber) {
        return axios.get(`${this._url}/api/v1/titles/${title_id}/reviews/${review_id}/comments/?page=${pageNumber}`)
    }

    createComment(title_id, review_id, value) {
        return axios.post(`${this._url}/api/v1/titles/${title_id}/reviews/${review_id}/comments/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    delComment(title_id, review_id, id) {
        return axios.delete(`${this._url}/api/v1/titles/${title_id}/reviews/${review_id}/comments/${id}/`, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    editComment(title_id, review_id, id, value) {
        return axios.patch(`${this._url}/api/v1/titles/${title_id}/reviews/${review_id}/comments/${id}/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    getUsers() {
        return axios.get(`${this._url}/api/v1/users/`,
            {
                headers: {
                    ...this._headers,
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        )
    }

    getMe() {
        return axios.get(`${this._url}/api/v1/users/me/`,
            {
                headers: {
                    ...this._headers,
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        )
    }

    getUser(username) {
        return axios.get(`${this._url}/api/v1/users/${username}/`,
            {
                headers: {
                    ...this._headers,
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        )
    }

    getUsersPagination(pageNumber) {
        return axios.get(`${this._url}/api/v1/users/?page=${pageNumber}`, 
            {
                headers: {
                    ...this._headers,
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        )
    }

    delUser(username) {
        return axios.delete(`${this._url}/api/v1/users/${username}/`, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    createUsers(value) {
        return axios.post(`${this._url}/api/v1/users/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

    editUsers(username, value) {
        return axios.patch(`${this._url}/api/v1/users/${username}/`, value, {
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    }

}

export default new Api(apiUrl || 'http://localhost', { 'content-type': 'application/json' })