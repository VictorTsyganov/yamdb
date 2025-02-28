import { Layout } from 'antd';
const { Footer } = Layout;

const footerStyle = {
    width: '100%',
    textAlign: 'center',
    height: 60,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: '#394ed9'
  };

export default function AppFooter() {
    return(
        <Footer style={footerStyle}>Footer</Footer>
    )
}