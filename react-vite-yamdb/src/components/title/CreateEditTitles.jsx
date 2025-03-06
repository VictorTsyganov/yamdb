/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, InputNumber, Select } from "antd"
import { useNavigate, useParams } from "react-router-dom"
import { useGenCatContext } from "../../context/gen-cat-context"
import api from "../../api"
import { useEffect, useState } from "react"
import ShowError from "../showError/ShowError"

export default function CreateEditTitles() {
    const { genresForm, categoriesForm } = useGenCatContext()
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const date = new Date
    const navigate = useNavigate()
    const { id } = useParams()
    const [form] = Form.useForm()

    const validateMessages = {
        required: 'Поле ${label} обязательно для заполнения!',
        types: {
            number: 'В поле ${label} должны быть цифры!',
        },
        number: {
            max: 'В поле ${label} должен быть год не более ${max}'
        }
    }
    const onFinish = (values) => {
        async function preCreateTitle() {
            api.createTitles(values).then(response => {
                if (response && response.status === 201) {
                    onClose()
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        async function preEditTitle() {
            api.editTitles(id, values).then(response => {
                if (response && response.status === 200) {
                    onClose()
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        if (id) {
            preEditTitle()
        } else {
            preCreateTitle()
        }

    }
    const onClose = () => {
        navigate(-1)
        form.resetFields()
    }

    async function preloadTitle(id) {
        api.getTitle(id).then(response => {
            if (response) {
                let gen = []
                response.data.genre.map((item) => {
                    gen.push(item.slug)
                })
                form.setFieldsValue({
                    category: response.data.category.slug,
                    description: response.data.description,
                    genre: gen,
                    name: response.data.name,
                    year: response.data.year
                })
            }
        })
            .catch(error => {
                setErrorMessage(error)
                setShowError(true)
            })
    }
    useEffect(() => {
        if (id) {
            preloadTitle(id)
        }
    }, [id])
    return (
        <>
            <ShowError
                showError={showError}
                errorMessage={errorMessage}
                setShowError={setShowError}
            />
            {!id && <h3>Создание произведения</h3>}
            {id && <h3>Изменение произведения</h3>}
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
                    label="Название произведения"
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
                    label="Год выпуска произведения"
                    name="year"
                    rules={[
                        {
                            required: true,
                            type: 'number',
                            max: date.getFullYear(),
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Описание произведения"
                    name="description"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="Жанры произведения"
                    name="genre"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        style={{
                            width: '100%',
                        }}
                        options={genresForm}
                        mode="multiple"
                        placeholder="Выбирите один или несколько жанров."
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    label="Категория произведения"
                    name="category"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        style={{
                            width: '100%',
                        }}
                        options={categoriesForm}
                        mode="single"
                        placeholder="Выбирите категорию."
                        allowClear
                    />
                </Form.Item>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
                    <Button type="primary" htmlType="submit" >
                        {id ? 'Сохранить изменения' : 'Создать'}
                    </Button>
                    <Button style={{ marginLeft: '1rem' }} type="primary" onClick={onClose} >
                        Закрыть
                    </Button>
                </div>
            </Form>
        </>
    )
}