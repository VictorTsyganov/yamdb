import { Button, Modal, message, Form, Input, Spin } from "antd";
import { useAuthContext } from "../../context/auth-context";
import ShowError from "../showError/ShowError";
import api from "../../api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const validateMessages = {
    required: 'Поле ${label} обязательно для заполнения!'
}

export default function Login() {
    const navigate = useNavigate()
    const { changeLoggedIn, setUserName } = useAuthContext()
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showLogin, setShowLogin] = useState(false)
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const onCloseModal = () => {
        setShowLogin(false)
        navigate(-1)
        form.resetFields()
    }
    const [messageApi, contextHolder] = message.useMessage();
    const successLogin = () => {
        messageApi.open({
            type: 'success',
            content: 'Успешная авторизация!',
        });
    };
    const [form] = Form.useForm()
    const onFinish = (values) => {
        async function preLogin() {
            api.login(values).then(response => {
                if (response && response.status === 200) {
                    setUserName(form.getFieldValue('username'))
                    sessionStorage.setItem('username', form.getFieldValue('username'))
                    successLogin()
                    changeLoggedIn(true)
                    setLoading(true)
                    sessionStorage.setItem('token', response.data.token)
                    setTimeout(() => {
                        setShowLogin(false)
                        setLoading(false)
                        navigate(-1)
                        form.resetFields()
                    }, 3000)

                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        preLogin()
    };
    const redirectSignup = () => {
        setShowLogin(false)
        form.resetFields()
        navigate('/signup' , { replace: true })
    }

    useEffect(() => {
        setShowLogin(true)
        if(location.state && location.state.username){
            form.setFieldsValue({
                username: location.state.username,
                confirmation_code: null
            })
        }
    }, [location, form])

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
                title="Авторизация"
                open={showLogin}
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
                      style={{
                        maxWidth: 600,
                      }}
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
                        label="Код подтверждения"
                        name="confirmation_code"
                        rules={[
                            {
                                required: true
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ display: "flex", justifyContent: "right" }}>
                        <Button type="text" onClick={redirectSignup} >
                            Регистрация
                        </Button>
                        <Button style={{ marginLeft: '1rem' }} type="primary" htmlType="submit" >
                            Авторизация
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