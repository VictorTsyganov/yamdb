import { useGenCatContext } from "../../context/gen-cat-context"
import { Spin, Space, Card, Button, Tooltip, Input, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons';
import './categoryStyle.css'
import useInput from "../../huhooks/useInput";
import { useAuthContext } from "../../context/auth-context";
import { useState } from "react";
import api from "../../api";
import CreateGenCatForm from "../createGenCatForm/createGenCatForm";
import ShowError from "../showError/ShowError";

const spaseStyle = {
    width: '100%',
    marginBottom: '1rem'
}

const cardStyle = {
    width: '100%',
    textAlign: 'left'
}

export default function ShowCategories() {
    const input = useInput()
    const { categories, loading } = useGenCatContext()
    const { loggedIn } = useAuthContext()
    const [showCreateCategory, setShowCreateCategory] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const delCategory = (category) => {
        async function preDelCategory() {
            api.delCategory(category).then(response => {
                if (response && response.status === 204) {
                    successDelCategory(category)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)

                })
        }
        preDelCategory()
    };

    const [messageApi, contextHolder] = message.useMessage();
    const successDelCategory = (category) => {
        messageApi.open({
            type: 'success',
            content: `Категория ${category} успешно удалена. Список категорий будет обновлен после обновления страницы.`,
        })

    }

    if (loading) {
        return <Spin fullscreen />
    }

    return (
        <>
            {contextHolder}
            <CreateGenCatForm showCreateGenCat={showCreateCategory} setShowCreateGenCat={setShowCreateCategory} />
            <ShowError
                showError={showError}
                errorMessage={errorMessage}
                setShowError={setShowError}
            />
            <Space direction="vertical" style={spaseStyle}>
                <h3 style={{ textAlign: 'left' }}>Поиск категории по названию</h3>
                <div className="menuBox">
                    <Input placeholder="Начните вводить название категории" onChange={input.onChange} />
                    {loggedIn && <Button type="primary" style={{ marginLeft: '1rem' }} onClick={() => { setShowCreateCategory(true) }}>
                        Создать новую категорию
                    </Button>}
                </div>
                {categories.filter((category) => category.name.toLowerCase().includes(input.value.toLowerCase()))
                    .map((category) => (
                        <Card
                            title={category.name}
                            key={category.slug}
                            style={cardStyle}
                        >
                            <div className="categoryInfoContent">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    className="categoryBtn"
                                    danger
                                    onClick={() => delCategory(category.slug)}
                                >
                                    <Tooltip title="Удалить категорию">
                                        <DeleteOutlined />
                                    </Tooltip>
                                </Button>
                            </div>
                        </Card>
                    ))}
            </Space>
        </>
    )
}