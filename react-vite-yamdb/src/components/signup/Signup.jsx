import { Button, Modal, Form, Input, message, Spin } from "antd";
import api from "../../api";
import { useEffect, useState } from "react";
import ShowError from "../showError/ShowError";
import { useNavigate } from "react-router-dom";

const validateMessages = {
    required: 'Поле ${label} обязательно для заполнения!',
    types: {
        email: 'Поле ${label} не соотвтетствует электронной почте!'
    }
}

export default function Signup() {
    const navigate = useNavigate()
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showSignup, setShowSignup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const onFinish = (values) => {
        async function preSignup() {
            api.signup(values).then(response => {
                if (response && response.status === 200) {
                    successSignup()
                    setLoading(true)
                    setTimeout(() => {
                        setLoading(false)
                        navigate('/login', { replace: true, state:{username: form.getFieldValue('username')}})
                        form.resetFields()
                    }, 3000)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        preSignup()
    };
    const onCloseModal = () => {
        setShowSignup(false)
        navigate(-1)
        form.resetFields()
    }
    const [messageApi, contextHolder] = message.useMessage();
    const successSignup = () => {
        messageApi.open({
            type: 'success',
            content: 'Успешная регистрация. Код подтверждения отправлен на указанный вами адрес электронной почты',
        })       

    }

    useEffect(() => {
        setShowSignup(true)
    }, [])

    return (
        <>
            {contextHolder}
            {loading && < Spin fullscreen />}
            <ShowError
                showError={showError}
                errorMessage={errorMessage}
                setShowError={setShowError}
            />
            <Modal
                title="Регистрация"
                open={showSignup}
                onCancel={onCloseModal}
                centered
                footer={null}
                zIndex={999}
            >
                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        label="Имя пользователя"
                        name="username"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Электронная почта"
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: 'email'
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ display: "flex", justifyContent: "right" }}>
                        <Button type="primary" htmlType="submit" >
                            Регистарция
                        </Button>
                        <Button style={{ marginLeft: '1rem' }} type="primary" onClick={onCloseModal} >
                            Закрыть
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}