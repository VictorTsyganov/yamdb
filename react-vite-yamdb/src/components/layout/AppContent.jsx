import { Layout } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HomeComponent from '../HomeComponent';
import ShowTitles from '../title/ShowTitles';
import { GenCatContextProvider } from '../../context/gen-cat-context';
import ShowGenres from '../genre/ShowGenres';
import axios from 'axios';
import ShowCategories from '../category/ShowCategories';
import Signup from '../signup/Signup';
import Login from '../login/Login';
import { useEffect } from 'react';
import { useAuthContext } from '../../context/auth-context';
import CreateEditTitles from '../title/CreateEditTitles';
import ShowReviews from '../reviews/ShowReviews';
import CreateEditReviews from '../reviews/CreateEditReviews';
const { Content } = Layout;

export default function AppContent() {
    const {changeLoggedIn, setUserName} = useAuthContext()
    const contentStyle = {
        textAlign: 'center',
        minHeight: 'calc(100vh - 120px)',
        background: 'none',
        padding: '1rem',
        overflow: 'auto',
        scrollbarWidth: 'none'
    };

    const navigate = useNavigate()

    useEffect(() => {
        axios.interceptors.response.use(response => {
            return response;
        }, (error) => {
            if (error.response.status === 401) {
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('username')
                changeLoggedIn(false)
                setUserName(null)
                navigate('/login')
            } else {
                return Promise.reject(error);
            }
        });
    })

    return (
        <>
            <Content style={contentStyle}>
                <GenCatContextProvider>
                    <Routes>
                        <Route path='/' element={<HomeComponent />} />
                        <Route path='/titles' element={<ShowTitles />} />
                        <Route path='/genres' element={<ShowGenres />} />
                        <Route path='/categories' element={<ShowCategories />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/create_titles/' element={<CreateEditTitles />} />
                        <Route path='/create_titles/:id' element={<CreateEditTitles />} />
                        <Route path='/titles/:title_id/reviews/' element={<ShowReviews />} />
                        <Route path='/titles/:title_id/create_reviews/' element={<CreateEditReviews />} />
                        <Route path='/titles/:title_id/create_reviews/:review_id' element={<CreateEditReviews />} />
                    </Routes>
                </GenCatContextProvider>
            </Content>
        </>
    )
}