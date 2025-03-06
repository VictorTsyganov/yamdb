import { useGenCatContext } from "../../context/gen-cat-context"
import { Spin, Space, Card, Button, Input, Tooltip, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons';
import './genreStyle.css'
import useInput from "../../huhooks/useInput";
import { useAuthContext } from "../../context/auth-context";
import { useState } from "react";
import api from "../../api";
import ShowError from "../showError/ShowError";
import CreateGenCatForm from "../createGenCatForm/createGenCatForm";

const spaseStyle = {
    width: '100%',
    marginBottom: '1rem'
}

const cardStyle = {
    width: '100%',
    textAlign: 'left'
}

export default function ShowGenres() {
    const input = useInput()
    const { genres, loading } = useGenCatContext()
    const { loggedIn } = useAuthContext()
    const [showCreateGenre, setShowCreateGenre] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const delGenre = (genre) => {
        async function preDelGenre() {
            api.delGenre(genre).then(response => {
                if (response && response.status === 204) {
                    successDelGenre(genre)
                }
            })
                .catch(error => {
                    setErrorMessage(error)
                    setShowError(true)
    
                })
        }
        preDelGenre()
    };
    const [messageApi, contextHolder] = message.useMessage();
    const successDelGenre = (genre) => {
        messageApi.open({
            type: 'success',
            content: `Жанр ${genre} успешно удален. Список жанров будет обновлен после обновления страницы.`,
        })       

    }

    if (loading) {
        return <Spin fullscreen />
    }

    return (
        <>
            {contextHolder}
            <CreateGenCatForm genre={true} showCreateGenCat={showCreateGenre} setShowCreateGenCat={setShowCreateGenre} />
            <ShowError
                showError={showError}
                errorMessage={errorMessage}
                setShowError={setShowError}
            />
            <Space direction="vertical" style={spaseStyle}>
                <h3 style={{ textAlign: 'left' }}>Поиск категории по названию</h3>
                <div className="menuBox">
                    <Input placeholder="Начните вводить название жанра" onChange={input.onChange} />
                    {loggedIn && <Button type="primary" style={{ marginLeft: '1rem' }} onClick={() => { setShowCreateGenre(true) }}>
                        Создать новый жанр
                    </Button>}
                </div>
                {genres.filter((genre) => genre.name.toLowerCase().includes(input.value.toLowerCase()))
                    .map((genre) => (
                        <Card
                            title={genre.name}
                            key={genre.slug}
                            style={cardStyle}
                        >
                            <div className="genreInfoContent">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size='small'
                                    className="genreBtn"
                                    danger
                                    onClick={() => delGenre(genre.slug)}
                                >
                                    <Tooltip title="Удалить жанр">
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