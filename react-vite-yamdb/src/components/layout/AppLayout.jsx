import { Layout } from 'antd';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import AppSider from './AppSider';
import AppContent from './AppContent';
import { useState } from 'react';
import AuthContextProvider from '../../context/auth-context';

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    height: '100vh'
};

export default function AppLayout() {
    const [siderVisible, setSiderVisible] = useState(true)

    function changeSiderVisible() {
        setSiderVisible(!siderVisible)
    }

    return (
        <AuthContextProvider>
            <Layout style={layoutStyle}>
                <AppHeader
                    siderVisible={setSiderVisible}
                    changeSiderVisible={changeSiderVisible}
                />
                <Layout>
                    <AppSider onChange={siderVisible} />
                    <AppContent />
                </Layout>
                <AppFooter />
            </Layout>
        </AuthContextProvider>

    )
}