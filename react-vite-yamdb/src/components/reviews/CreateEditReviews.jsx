/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, Rate, Space, Tooltip } from "antd"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { LeftCircleTwoTone } from '@ant-design/icons';
import ShowError from "../showError/ShowError";
import { useEffect, useState } from "react";
import api from "../../api";

const spaseStyle = {
    width: '100%',
    marginBottom: '1rem'
}

export default function CreateEditReviews() {
    const location = useLocation()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { title_id, review_id } = useParams()

    const validateMessages = {
        required: 'Поле ${label} обязательно для заполнения!'
    }

    const onFinish = (values) => {
        const new_score_data = {
            text: values.text,
            score: values.score * 2
        }
        async function preCreateReview() {
            api.createReviews(title_id, new_score_data).then(response => {
                if (response && response.status === 201) {
                    onClose()
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        async function preEditReview() {
                    api.editReviews(title_id, review_id, new_score_data).then(response => {
                        if (response && response.status === 200) {
                            onClose()
                        }
                    })
                        .catch(error => {
                            setErrorMessage(error)
                            setShowError(true)
        
                        })
                }
        if(review_id){
            preEditReview()
        } else {
            preCreateReview()
        }
    }

    async function preloadReview() {
            api.getReview(title_id, review_id).then(response => {
                if (response) {
                    form.setFieldsValue({
                        text: response.data.text,
                        score: response.data.score / 2
                    })
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)
                })
        }

    const onClose = () => {
        navigate(-1)
        form.resetFields()
    }

    useEffect(() => {
        if(review_id) {
            preloadReview()
        }
    }, [review_id])

    return (
        <>
            <ShowError
                showError={showError}
                errorMessage={errorMessage}
                setShowError={setShowError}
            />
            {location.state && location.state.title_name && <h2>{review_id? 'Изменение ': 'Создание нового '}отзыва к произведению {location.state.title_name}</h2>}
            <Space direction="vertical" style={spaseStyle}>
                <div className="menuBoxTitle">
                    <div>
                        <Button
                            type="primary"
                            shape="circle"
                            size='medium'
                            onClick={onClose}
                        >
                            <Tooltip title="Назад">
                                <LeftCircleTwoTone />
                            </Tooltip>
                        </Button>
                    </div>
                    <div>
                    </div>
                </div>
            </Space>
            <br />
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                validateMessages={validateMessages}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 15,
                }}
                style={{
                    width: '100%',
                }}
            >
                <Form.Item
                    label="Текст отзыва"
                    name="text"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="Оценка"
                    name="score"
                    rules={[
                        {
                            required: true
                        },
                    ]}
                >
                    <Rate allowHalf/>
                </Form.Item>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
                    <Button type="primary" htmlType="submit" >
                        {review_id ? 'Сохранить изменения' : 'Создать'}
                    </Button>
                    <Button style={{ marginLeft: '1rem' }} type="primary" onClick={onClose} >
                        Закрыть
                    </Button>
                </div>
            </Form>
        </>
    )
}