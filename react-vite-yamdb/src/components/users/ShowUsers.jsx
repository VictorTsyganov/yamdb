/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, message, Pagination, Space, Spin, Tooltip } from "antd"
import { useEffect, useState } from "react"
import CustomSpin from "../customSpin/CustomSpin"
import ShowError from "../showError/ShowError"
import { useAuthContext } from "../../context/auth-context"
import { NavLink, useNavigate } from "react-router-dom"
import api from "../../api"
import { DownOutlined, UpOutlined, UserDeleteOutlined, UserSwitchOutlined } from '@ant-design/icons';

const spaseStyle = {
    width: '100%',
    marginBottom: '1rem'
}

const cardStyle = {
    width: '100%',
    textAlign: 'left'
}

export default function ShowUsers() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loadingFullScr, setLoadingFullScr] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { loggedIn } = useAuthContext()
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [currentUserId, setCurrentUserId] = useState(0)
    const [showAdditional, setShowAdditional] = useState(false)

    async function preloadUsersPagination(pageNumber) {
        setLoading(true)
        api.getUsersPagination(pageNumber).then(response => {
            if (response) {
                setUsers(response.data)
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
        preloadUsersPagination(pageNumber)
    }

    async function preloadMe() {
        const tempList = []
        setLoading(true)
        api.getMe().then(response => {
            if (response) {
                tempList.push(response.data)
                console.log(tempList)
                setUsers({
                    results: tempList
                })
            }
            setLoading(false)
        })
            .catch(error => {
                setErrorMessage(error)
                setLoading(false)
                setShowError(true)
            })
    }

    async function preloadUsers() {
        setLoading(true)
        api.getUsers().then(response => {
            if (response) {
                setUsers(response.data)
            }
            setLoading(false)
        })
            .catch(error => {
                if(error.status === 403) {
                    preloadMe()
                } else {
                    setErrorMessage(error)
                    setLoading(false)
                    setShowError(true)
                }
            })
    }

    useEffect(() => {
        preloadUsers()
    }, [])

    const delUser = (username) => {
        async function preDelUser() {
            api.delUser(username).then(response => {
                if (response && response.status === 204) {
                    successDelUser(username)
                    setLoadingFullScr(true)
                    setTimeout(() => {
                        setLoadingFullScr(false)
                        setCurrentPage(1)
                        preloadUsers()
                    }, 3000)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        preDelUser()
    }

    const editUser = (usermane) => {
        navigate(`/create_user/${usermane}`)
    };

    const [messageApi, contextHolder] = message.useMessage();
    const successDelUser = (username) => {
        messageApi.open({
            type: 'success',
            content: `Пользователь ${username} успешно удален.`,
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
                    <div>
                        {loggedIn && <NavLink to="/create_user/me">
                            <Button type="primary">
                                Изменить свои данные
                            </Button>
                        </NavLink>}
                    </div>
                    <div>
                        {loggedIn && <NavLink to="/create_user">
                            <Button type="primary" style={{ marginLeft: '1rem' }}>
                                Создать пользователя
                            </Button>
                        </NavLink>}
                    </div>
                </div>
                {users.results && users.results.map((user, index) => (
                    <Card
                        title={user.username}
                        key={index}
                        extra={<div>{user.role}</div>}
                        style={cardStyle}
                    >
                        <div className="titleInfoContent">
                            <p>
                                {user.first_name && <><b>Имя: </b>{user.first_name}</>} {user.last_name && <><b> Фамилия: </b>{user.last_name}</>}
                            </p>
                            <div className="funcBtnBox">
                                {loggedIn && <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    danger
                                    onClick={() => { delUser(user.username) }}
                                >
                                    <Tooltip title="Удалить пользователя">
                                        <UserDeleteOutlined />
                                    </Tooltip>
                                </Button>}
                                {loggedIn && <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    onClick={() => { editUser(user.username) }}
                                >
                                    <Tooltip title="Изменить данные пользователя">
                                    <UserSwitchOutlined />
                                    </Tooltip>
                                </Button>}
                                {loggedIn && <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    style={{ marginLeft: '1rem' }}
                                    onClick={() => {
                                        setShowAdditional(index === currentUserId ? !showAdditional : true)
                                        setCurrentUserId(index)
                                    }}
                                >
                                    {index === currentUserId && showAdditional ? <Tooltip title="Cкрыть дополнительную информацию">
                                        <UpOutlined />
                                    </Tooltip> : <Tooltip title="Показать дополнительную информацию">
                                        <DownOutlined />
                                    </Tooltip>}
                                </Button>}
                            </div>
                        </div>
                        {index === currentUserId && showAdditional && <div className="titleAdditionalInfoContent">
                            <div>
                                <h4>О пользователе:</h4>
                                <ul>
                                    <li style={{ marginLeft: '1rem' }}>{user.bio}</li>
                                </ul>
                            </div>
                        </div>}
                    </Card>
                ))}
            </Space>
            {users.results?.length > 0 && <Pagination defaultCurrent={currentPage} total={users.count} onChange={pgOnChange} />}
            {users.results?.length === 0 && <p>Произведения не найдены</p>}
        </>
    )
}