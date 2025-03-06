/* eslint-disable react/prop-types */
import { Layout, Button, Tooltip, message } from 'antd';
import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LoginOutlined,
    LogoutOutlined,
    SignatureOutlined
} from '@ant-design/icons';
import { useAuthContext } from '../../context/auth-context';
import { NavLink, useNavigate } from 'react-router-dom';
const { Header } = Layout;
const headerStyle = {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    height: 60,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: '#394ed9'
};
const btnStyle = {
    fontSize: '16px',
    width: 64,
    height: 64,
    color: 'white'
}

export default function AppHeader({ siderVisible, changeSiderVisible }) {
    const navigate = useNavigate()
    const [siderVisibleIcon, setSiderVisibleIcon] = useState(true)
    const { loggedIn, userName, changeLoggedIn, setUserName } = useAuthContext()
    const [messageApi, contextHolder] = message.useMessage();
    const logoutMessage = () => {
        messageApi.open({
            type: 'success',
            content: 'Успешный выход из аккаунта'
        })
    }
    const logout = () => {
        changeLoggedIn(!loggedIn)
        setUserName(null)
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('username')
        logoutMessage()
        navigate('/')
    }

    return (
        <>
            {contextHolder}
            <Header style={headerStyle}>
                <Button
                    type="text"
                    icon={siderVisibleIcon ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    onClick={() => {
                        setSiderVisibleIcon(!siderVisibleIcon)
                        changeSiderVisible(!siderVisible)
                    }}
                    style={btnStyle}
                />
                YaMDb. Отзывы пользователей на различные произведения.
                <div style={{ display: 'flex' }}>
                    {!loggedIn && <NavLink to="/login">
                        <Button type="text" style={btnStyle}>
                            <Tooltip title="Вход">
                                <LoginOutlined />
                            </Tooltip>
                        </Button>
                    </NavLink>}
                    {!loggedIn && <NavLink to="/signup">
                        <Button type="text" style={btnStyle}>
                            <Tooltip title="Регистарция">
                                <SignatureOutlined />
                            </Tooltip>
                        </Button>
                    </NavLink>}
                    {loggedIn && <p>Пользователь: {userName}</p>}
                    {loggedIn &&
                        <Button type="text" style={btnStyle} onClick={logout}>
                            <Tooltip title="Выход">
                                <LogoutOutlined />
                            </Tooltip>
                        </Button>}
                </div>
            </Header>
        </>
    )
}