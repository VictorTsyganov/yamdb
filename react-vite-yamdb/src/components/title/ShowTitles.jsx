import { useEffect, useState } from "react"
import api from "../../api";
import { Card, Space, Pagination, Rate, Button, Tooltip, message, Spin } from 'antd'
import { DownOutlined, UpOutlined, DeleteOutlined, EditOutlined, FileTextTwoTone } from '@ant-design/icons';
import CustomSpin from "../customSpin/CustomSpin";
import './titleStyle.css'
import ShowError from "../showError/ShowError";
import { useAuthContext } from "../../context/auth-context";
import { NavLink, useNavigate } from "react-router-dom";

const spaseStyle = {
    width: '100%',
    marginBottom: '1rem'
}

const cardStyle = {
    width: '100%',
    textAlign: 'left'
}

export default function ShowTitles() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loadingFullScr, setLoadingFullScr] = useState(false)
    const [showAdditional, setShowAdditional] = useState(false)
    const [titles, setTitles] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [currentTitleId, setCurrentTitleId] = useState(0)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { loggedIn } = useAuthContext()

    async function preloadTitlesPagination(pageNumber) {
        setLoading(true)
        api.getTitlesPagination(pageNumber).then(response => {
            if (response) {
                setTitles(response.data)
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

    const pgOnChange = (pageNumber) => {
        preloadTitlesPagination(pageNumber)
    }

    async function preloadTitles() {
        setLoading(true)
        api.getTitles().then(response => {
            if (response) {
                setTitles(response.data)
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
        preloadTitles()
    }, [])

    const delTitle = (id, name) => {
        async function preDelTitle() {
            api.delTitles(id).then(response => {
                if (response && response.status === 204) {
                    successDelTitles(name)
                    setLoadingFullScr(true)
                    setTimeout(() => {
                        setLoadingFullScr(false)
                        preloadTitles()
                    }, 3000)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        preDelTitle()
    };

    const getReviews = (id, name) => {
        navigate(`/titles/${id}/reviews/`, { state: { title_name: name } })
    };

    const editTitle = (id) => {
        navigate(`/create_titles/${id}`)
    };

    const [messageApi, contextHolder] = message.useMessage();
    const successDelTitles = (title) => {
        messageApi.open({
            type: 'success',
            content: `Произведение ${title} успешно удалено.`,
        })

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
            <Space direction="vertical" style={spaseStyle}>
                <div className="menuBoxTitle">
                    <div></div>
                    <div>
                        {loggedIn && <NavLink to="/create_titles">
                            <Button type="primary" style={{ marginLeft: '1rem' }}>
                                Добавить новое произведение
                            </Button>
                        </NavLink>}
                    </div>
                </div>
                {titles.results && titles.results.map((title) => (
                    <Card
                        title={title.name}
                        key={title.id}
                        extra={<Rate allowHalf disabled defaultValue={title.rating / 2} />}
                        style={cardStyle}
                    >
                        <div className="titleInfoContent">
                            <p>
                                Год выпуска произведения: {title.year}
                            </p>
                            <div className="funcBtnBox">
                                {loggedIn && <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    danger
                                    onClick={() => { delTitle(title.id, title.name) }}
                                >
                                    <Tooltip title="Удалить произведение">
                                        <DeleteOutlined />
                                    </Tooltip>
                                </Button>}
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    onClick={() => { getReviews(title.id, title.name) }}
                                >
                                    <Tooltip title="Отзывы к произведению">
                                        <FileTextTwoTone />
                                    </Tooltip>
                                </Button>
                                {loggedIn && <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    onClick={() => { editTitle(title.id) }}
                                >
                                    <Tooltip title="Изменить произведение">
                                        <EditOutlined />
                                    </Tooltip>
                                </Button>}
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    onClick={() => {
                                        setShowAdditional(title.id === currentTitleId ? !showAdditional : true)
                                        setCurrentTitleId(title.id)
                                    }}
                                >
                                    {title.id === currentTitleId && showAdditional ? <Tooltip title="Cкрыть дополнительную информацию">
                                        <UpOutlined />
                                    </Tooltip> : <Tooltip title="Показать дополнительную информацию">
                                        <DownOutlined />
                                    </Tooltip>}
                                </Button>
                            </div>
                        </div>
                        {title.id === currentTitleId && showAdditional && <div className="titleAdditionalInfoContent">
                            <div>
                                <h4>Жанры:</h4>
                                <ul>
                                    {title.genre.map(gen => (
                                        <li key={gen.slug} style={{ marginLeft: '1rem' }}>{gen.name}</li>
                                    ))}
                                </ul>
                                <h4>Категория:</h4>
                                <ul>
                                    <li style={{ marginLeft: '1rem' }}>{title.category.name}</li>
                                </ul>
                            </div>
                            {title.description && <div style={{ marginLeft: '1rem' }}>
                                <h4>Описание:</h4>
                                <ul>
                                    <li style={{ marginLeft: '1rem' }}>{title.description}</li>
                                </ul>
                            </div>}
                        </div>}
                    </Card>
                ))}
            </Space>
            {titles.results?.length > 0 && <Pagination defaultCurrent={currentPage} total={titles.count} onChange={pgOnChange} />}
            {titles.results?.length === 0 && <p>Произведения не найдены</p>}
        </>
    )
}