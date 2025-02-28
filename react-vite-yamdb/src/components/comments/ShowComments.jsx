/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import CustomSpin from "../customSpin/CustomSpin"
import api from "../../api"
import { Button, Col, DatePicker, Divider, Input, message, Pagination, Row, Space, Spin, Tooltip } from "antd"
import ShowError from "../showError/ShowError"
import dayjs from 'dayjs';
import useInput from "../../huhooks/useInput"
import { useAuthContext } from "../../context/auth-context"
import { CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

/* eslint-disable react/prop-types */
export default function ShowComments({ title_id, review_id }) {
    const input = useInput()
    const inputEdit = useInput()
    const dateFormat = 'YYYY-MM-DD'
    const showDateFormat = 'DD-MM-YYYY'
    const [loading, setLoading] = useState(false)
    const [loadingFullScr, setLoadingFullScr] = useState(false)
    const [comments, setComments] = useState([])
    const [showError, setShowError] = useState(false)
    const [showEditCommentField, setShowEditCommentField] = useState(false)
    const [currentComment, setCurrentComment] = useState(-1)
    const [errorMessage, setErrorMessage] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const { loggedIn } = useAuthContext()

    async function preloadCommentsPagination(pageNumber) {
        setLoading(true)
        api.getCommentsPagination(title_id, review_id, pageNumber).then(response => {
            if (response) {
                setComments(response.data)
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
        preloadCommentsPagination(pageNumber)
    }

    async function preloadComments() {
        setLoading(true)
        api.getComments(title_id, review_id).then(response => {
            if (response) {
                setComments(response.data)
            }
            setLoading(false)
        })
            .catch(error => {
                setErrorMessage(error)
                setLoading(false)
                setShowError(true)
            })
    }

    const addComment = () => {
        const com = {
            text: input.value
        }
        async function preCreateComment() {
            setLoadingFullScr(true)
            api.createComment(title_id, review_id, com).then(response => {
                if (response && response.status === 201) {
                    preloadCommentsPagination(currentPage)
                    input.onClear()
                }
                setLoadingFullScr(false)
            })
                .catch(error => {
                    setErrorMessage(error)
                    setLoadingFullScr(false)
                    setShowError(true)
                })
        }
        preCreateComment()
    }

    const delComment = (id) => {
        async function preDelComment() {
            api.delComment(title_id, review_id, id).then(response => {
                if (response && response.status === 204) {
                    successDelComment(id)
                    setLoadingFullScr(true)
                    setTimeout(() => {
                        setLoadingFullScr(false)
                        preloadCommentsPagination(currentPage)
                    }, 3000)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        preDelComment()
    };

    const getEditComment = (id) => {
        setShowEditCommentField(id === currentComment? !showEditCommentField : true)
        setCurrentComment(id)
        async function preGetEditComment() {
            api.getComment(title_id, review_id, id).then(response => {
                if (response && response.status === 200) {
                    inputEdit.onSetValue(response.data.text)
                }
            })
                .catch(error => {
                    inputEdit.onSetValue('')
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        if(id !== currentComment){
            preGetEditComment()
        }        
    }

    const editComment = (id) => {
        const com = {
            text: inputEdit.value
        }
        async function preEditComment() {
            api.editComment(title_id, review_id, id, com).then(response => {
                if (response && response.status === 200) {
                    successEditComment(id)
                    setCurrentComment(-1)
                    setShowEditCommentField(false)
                    inputEdit.onClear()
                    setLoadingFullScr(true)
                    setTimeout(() => {
                        setLoadingFullScr(false)
                        preloadCommentsPagination(currentPage)
                    }, 3000)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        preEditComment()
    };

    const [messageApi, contextHolder] = message.useMessage();
    const successDelComment = (id) => {
        messageApi.open({
            type: 'success',
            content: `Комментарий ${id} успешно удален.`,
        })

    }

    const successEditComment = (id) => {
        messageApi.open({
            type: 'success',
            content: `Комментарий ${id} успешно изменен.`,
        })

    }

    useEffect(() => {
        preloadComments()
    }, [])

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
            <Divider />
            {comments.results?.length === 0 && <h5 style={{
                marginTop: '1rem'
            }}>К данному отзыву нет комментариев</h5>}
            <Space.Compact
                style={{
                    width: '100%',
                    marginTop: '1rem',
                    marginBottom: '1rem'
                }}
            >
                <Input rows={4} placeholder="Напишите сюда ваш комментарий" onChange={input.onChange} />
                <Button type="primary" onClick={() => { addComment() }}>Добавить комментарий</Button>
            </Space.Compact>
            <Divider />
            {comments.results && comments.results.map((comment) => (
                <div key={comment.id}>
                    <Row>
                        <Col span={6}><h5>Дата: </h5><DatePicker size="small" disabled defaultValue={dayjs(comment.pub_date, dateFormat)} format={showDateFormat} /></Col>
                        <Col span={12}><h5>Автор: </h5>{comment.author}</Col>
                        <Col span={6} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                            {loggedIn && <Button
                                type="primary"
                                shape="circle"
                                size='small'
                                style={{ marginLeft: '1rem' }}
                                danger
                                onClick={() => { delComment(comment.id) }}
                            >
                                <Tooltip title="Удалить комментарий">
                                    <DeleteOutlined />
                                </Tooltip>
                            </Button>}
                            {loggedIn && <Button
                                type="primary"
                                shape="circle"
                                size='small'
                                style={{ marginLeft: '1rem' }}
                                onClick={() => { getEditComment(comment.id) }}
                            >
                                {comment.id === currentComment && showEditCommentField ? <Tooltip title="Отменить изменения">
                                    <CloseOutlined />
                                </Tooltip> : <Tooltip title="Изменить комментарий">
                                    <EditOutlined />
                                </Tooltip>}
                            </Button>}
                        </Col>
                    </Row>
                    <Row>
                        {showEditCommentField && comment.id === currentComment? <Col span={24}>
                            <Space.Compact
                                style={{
                                    width: '100%',
                                    marginTop: '1rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                <Input rows={4} onChange={inputEdit.onChange} value={inputEdit.value} />
                                <Button type="primary" onClick={() => { editComment(comment.id) }}>Сохранить изменения</Button>
                            </Space.Compact>
                        </Col> : <Col span={24}><h5>Комментарий: </h5>{comment.text}</Col>}

                    </Row>
                    <Divider />
                </div>
            ))}
            {comments.results?.length > 0 && <Pagination style={{ marginTop: '1rem' }} defaultCurrent={currentPage} total={comments.count} onChange={pgOnChange} />}
        </>
    )
}