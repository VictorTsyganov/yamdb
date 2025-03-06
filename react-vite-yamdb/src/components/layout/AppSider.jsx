import { Layout, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { BookOutlined, HomeOutlined, SnippetsOutlined, FormOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../context/auth-context';
const { Sider } = Layout;

const siderStyle = {
  padding: '1rem',
  background: 'none',
  borderRight: '1px solid black',
  minHeight: 'calc(100vh - 120px)',
};

const menuStyle = {
  background: 'none',
  width: 'auto',
  border: 'none',
}

export default function AppSider(siderVisible) {
  const { loggedIn } = useAuthContext()
  const items = [
    {
      key: 'home',
      label: (
        <NavLink to="/">Home</NavLink>
      ),
      icon: <HomeOutlined />,
    },
    {
      key: 'titles',
      label: (
        <NavLink to="/titles">Titles</NavLink>
      ),
      icon: <BookOutlined />,
    },
    {
      key: 'genres',
      label: (
        <NavLink to="/genres">Genres</NavLink>
      ),
      icon: <SnippetsOutlined />,
    },
    {
      key: 'categories',
      label: (
        <NavLink to="/categories">Categories</NavLink>
      ),
      icon: <FormOutlined />,
    },
    {
      key: 'users',
      label: (
        <NavLink to="/users">Users</NavLink>
      ),
      icon: <UserOutlined />,
      disabled: !loggedIn
      
    }
  ]

  if (siderVisible.onChange) return (
    <Sider
      style={siderStyle}
      width='25%'
    >
      <Menu
        style={menuStyle}
        mode="inline"
        items={items}
      />
    </Sider>
  )
}