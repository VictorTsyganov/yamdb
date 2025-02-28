import { Spin } from 'antd'

export default function CustomSpin() {
    const spinStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'none',
    };

    return <Spin style={spinStyle} />
}