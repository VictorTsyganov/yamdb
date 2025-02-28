/* eslint-disable react/prop-types */
import { Button, Modal, message, Form, Input } from "antd";
import ShowError from "../showError/ShowError";
import { useState } from "react";
import api from "../../api";

const validateMessages = {
    required: 'Поле ${label} обязательно для заполнения!'
}

export default function CreateGenCatForm({ genre = false, showCreateGenCat, setShowCreateGenCat }) {
    const [showError, setShowError] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const [errorMessage, setErrorMessage] = useState('')
    const [form] = Form.useForm()
    const successAddGenre = (genre) => {
        messageApi.open({
            type: 'success',
            content: `Жанр ${genre} успешно создан. Список жанров будет обновлен после обновления страницы.`,
        })       

    }
    const successAddCategory = (category) => {
        messageApi.open({
            type: 'success',
            content: `Категория ${category} успешно создана. Список категорий будет обновлен после обновления страницы.`,
        })       

    }
    const onCloseModal = () => {
        setShowCreateGenCat(false)
        form.resetFields()
    }
    const onFinish = (values) => {
        async function preCreateGenre() {
            api.createGenre(values).then(response => {
                if (response && response.status === 201) {
                    onCloseModal()
                    successAddGenre(response.data.name)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        async function preCreateCategory() {
            api.createCategory(values).then(response => {
                if (response && response.status === 201) {
                    onCloseModal()
                    successAddCategory(response.data.name)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        if (genre) {
            preCreateGenre()
        } else {
            preCreateCategory()
        }
    };

    return (
        <>
            {contextHolder}
            <ShowError
                showError={showError}
                errorMessage={errorMessage}
                setShowError={setShowError}
            />
            <Modal
                title={genre? "Создание жанра": "Создание категории"}
                open={showCreateGenCat}
                onCancel={onCloseModal}
                centered
                footer={null}
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
                        label={genre? "Название жанра": "Название категории"}
                        name="name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ display: "flex", justifyContent: "right" }}>
                        <Button type="primary" htmlType="submit" >
                            Создать
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