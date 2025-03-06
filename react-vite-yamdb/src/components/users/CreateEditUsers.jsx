/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ShowError from "../showError/ShowError";
import { Button, Form, Input, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const validateMessages = {
    required: 'Поле ${label} обязательно для заполнения!',
    types: {
        email: 'Поле ${label} не соотвтетствует электронной почте!'
    }
}

const rolesForm = [
    {label: 'admin', value: 'admin'},
    {label: 'moderator', value: 'moderator'},
    {label: 'user', value: 'user'},
]

export default function CreateEditUsers() {
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { username } = useParams()
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const onFinish = (values) => {
        async function preCreateUsers() {
            api.createUsers(values).then(response => {
                if (response && response.status === 201) {
                    onClose()
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        async function preEditUsers() {
            api.editUsers(username, values).then(response => {
                if (response && response.status === 200) {
                    onClose()
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        if (username) {
            preEditUsers()
        } else {
            preCreateUsers()
        }

    }

    const onClose = () => {
        navigate(-1)
        form.resetFields()
    }

    async function preloadUser(username) {
        api.getUser(username).then(response => {
            if (response) {
                console.log(response)
                form.setFieldsValue({
                    username: response.data.username,
                    email: response.data.email,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    bio: response.data.bio,
                    role: response.data.role
                })
            }
        })
            .catch(error => {
                setErrorMessage(error)
                setShowError(true)
            })
    }
    useEffect(() => {
        if (username) {
            preloadUser(username)
        }
    }, [username])

    return (
        <>
            <ShowError
                showError={showError}
                errorMessage={errorMessage}
                setShowError={setShowError}
            />
            {!username && <h3>Создание нового пользователя</h3>}
            {username && <h3>Изменение данных пользователя</h3>}
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
                <Form.Item
                    label="Имя"
                    name="first_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Фамилия"
                    name="last_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Описание пользователя"
                    name="bio"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                {username !== 'me' && <Form.Item
                    label="Роль"
                    name="role"
                    mode="single"
                >
                    <Select
                        style={{
                            width: '100%',
                        }}
                        options={rolesForm}
                        placeholder="Выбирите роль пользователя."
                        allowClear
                    />
                </Form.Item>}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
                    <Button type="primary" htmlType="submit" >
                        {username ? 'Сохранить изменения' : 'Создать'}
                    </Button>
                    <Button style={{ marginLeft: '1rem' }} type="primary" onClick={onClose} >
                        Закрыть
                    </Button>
                </div>
            </Form>
        </>
    )
}