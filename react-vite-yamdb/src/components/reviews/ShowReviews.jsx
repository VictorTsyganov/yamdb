/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, DatePicker, message, Pagination, Rate, Space, Spin, Tooltip } from "antd";
import { DeleteOutlined, DownOutlined, EditOutlined, LeftCircleTwoTone, UpOutlined } from '@ant-design/icons';
import CustomSpin from "../customSpin/CustomSpin"
import ShowError from "../showError/ShowError"
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/auth-context";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import dayjs from 'dayjs';
import ShowComments from "../comments/ShowComments";

const spaseStyle = {
    width: '100%',
    marginBottom: '1rem'
}

const cardStyle = {
    width: '100%',
    textAlign: 'left'
}

export default function ShowReviews() {
    const dateFormat = 'YYYY-MM-DD'
    const showDateFormat = 'DD-MM-YYYY'
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loadingFullScr, setLoadingFullScr] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [reviews, setReviews] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const { loggedIn } = useAuthContext()
    const { title_id } = useParams()
    const location = useLocation()
    const [currentReviewId, setCurrentReviewId] = useState(0)
    const [showAdditional, setShowAdditional] = useState(false)

    const [messageApi, contextHolder] = message.useMessage();
    const successDelReviews = (id) => {
        messageApi.open({
            type: 'success',
            content: `Отзыв ${id} успешно удален.`,
        })

    }

    async function preloadReviews() {
        setLoading(true)
        api.getReviews(title_id).then(response => {
            if (response) {
                setReviews(response.data)
            }
            setLoading(false)
        })
            .catch(error => {
                setErrorMessage(error)
                setLoading(false)
                setShowError(true)
            })
    }

    useEffect(() => {
        preloadReviews()
    }, [])

    const pgOnChange = (pageNumber) => {
        async function preloadReviewsPagination() {
            setLoading(true)
            api.getReviewsPagination(title_id, pageNumber).then(response => {
                if (response) {
                    setReviews(response.data)
                    setCurrentPage(pageNumber)
                }
                setLoading(false)
            })
                .catch(error => {
                    setErrorMessage(error)
                    setLoading(false)
                    setShowError(true)

                })
        }
        preloadReviewsPagination()
    }

    const delReview = (review_id) => {
        async function preDelReview() {
            api.delReviews(title_id, review_id).then(response => {
                if (response && response.status === 204) {
                    successDelReviews(review_id)
                    setLoadingFullScr(true)
                    setTimeout(() => {
                        setLoadingFullScr(false)
                        preloadReviews()
                    }, 3000)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        preDelReview()
    };

    const editReview = (review_id) => {
        navigate(`/titles/${title_id}/create_reviews/${review_id}`, { state: { title_name: location.state.title_name } })
    };

    const showComments = (id) => {
        setShowAdditional(id === currentReviewId ? !showAdditional : true)
        setCurrentReviewId(id)
    }

    if (loading) {
        return <CustomSpin />
    }

    return (
        <>
            {contextHolder}
            {loadingFullScr && < Spin fullscreen />}
            <ShowError
                showError={showError}
                errorMessage={errorMessage}
                setShowError={setShowError}
            />
            {location.state && location.state.title_name && <h2>Отзывы к произведению {location.state.title_name}</h2>}
            <Space direction="vertical" style={spaseStyle}>
                <div className="menuBoxTitle">
                    <div>
                        <Button
                            type="primary"
                            shape="circle"
                            size='medium'
                            onClick={() => { navigate(-1) }}
                        >
                            <Tooltip title="Назад">
                                <LeftCircleTwoTone />
                            </Tooltip>
                        </Button>
                    </div>
                    <div>
                        {loggedIn && <NavLink to={`/titles/${title_id}/create_reviews/`} state={{ title_name: location.state.title_name }}>
                            <Button type="primary" style={{ marginLeft: '1rem' }}>
                                Добавить новый отзыв
                            </Button>
                        </NavLink>}
                    </div>
                </div>
                {reviews.results && reviews.results.map((review) => (
                    <Card
                        title={review.author}
                        key={review.id}
                        extra={<Rate allowHalf disabled defaultValue={review.score / 2} />}
                        style={cardStyle}
                    >
                        <div className="titleInfoContent">
                            {review.text && <div style={{ marginLeft: '1rem' }}>
                                <h5>
                                    Дата публикации: <DatePicker size="small" disabled defaultValue={dayjs(review.pub_date, dateFormat)} format={showDateFormat} />
                                </h5>
                                <h5>Описание:</h5>
                                <ul>
                                    <li style={{ marginLeft: '1rem' }}>{review.text}</li>
                                </ul>
                            </div>}
                            <div className="funcBtnBox">
                                {loggedIn && <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    danger
                                    onClick={() => { delReview(review.id) }}
                                >
                                    <Tooltip title="Удалить отзыв">
                                        <DeleteOutlined />
                                    </Tooltip>
                                </Button>}
                                {loggedIn && <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    onClick={() => { editReview(review.id) }}
                                >
                                    <Tooltip title="Изменить отзыв">
                                        <EditOutlined />
                                    </Tooltip>
                                </Button>}
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    onClick={() => {showComments(review.id)}}
                                >
                                    {review.id === currentReviewId && showAdditional ? <Tooltip title="Cкрыть комментарии к отзыву">
                                        <UpOutlined />
                                    </Tooltip> : <Tooltip title="Показать комментарии к отзыву">
                                        <DownOutlined />
                                    </Tooltip>}
                                </Button>
                            </div>
                        </div>
                        {review.id === currentReviewId && showAdditional && <div className="titleAdditionalInfoContent">
                            {review.text && <div style={{ width: '100%', marginLeft: '1rem' }}>
                                <h4>Комментарии:</h4>
                                <ShowComments title_id={title_id} review_id={review.id}/>
                            </div>}
                        </div>}
                    </Card>
                ))}
            </Space>
            {reviews.results?.length > 0 && <Pagination defaultCurrent={currentPage} total={reviews.count} onChange={pgOnChange} />}
            {reviews.results?.length === 0 && <p>К данному произведению нет отзывов</p>}
        </>
    )
}