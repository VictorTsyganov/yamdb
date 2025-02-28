/* eslint-disable react/prop-types */
import { Button, Modal } from "antd";

export default function ShowError({ showError, errorMessage, setShowError }) {
    const message = errorMessage.message
    const errorData = errorMessage.response
    console.log(errorMessage)
    return (
        <Modal
            title="Ошибка"
            open={showError}
            onCancel={() => setShowError(false)}
            centered
            footer={
                <Button type="primary" onClick={() => setShowError(false)} >
                    Закрыть
                </Button>
            }
        >
            <p>{message}</p>
            {errorData && errorData.data && errorData.data.email && <>
                <h5>Email errors</h5>
                <ul>
                    {errorData.data.email.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </>}
            {errorData && errorData.data && errorData.data.username && <>
                <h5>Username errors</h5>
                <ul>
                    {errorData.data.username.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </>}
            {errorData && errorData.data && errorData.data.detail && <>
                <h5>Detail errors</h5>
                <ul>
                    <li>{errorData.data.detail}</li>
                </ul>
            </>}
            {errorData && errorData.data && errorData.data.confirmation_code && <>
                <h5>Detail errors</h5>
                <ul>
                    <li>{errorData.data.confirmation_code}</li>
                </ul>
            </>}
            {errorData && errorData.data && errorData.data.slug && <>
                <h5>Slug errors</h5>
                <ul>
                    {errorData.data.slug.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </>}
            {errorData && errorData.data && errorData.data.year && <>
                <h5>Year errors</h5>
                <ul>
                    {errorData.data.year.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </>}
            {errorData && errorData.data && errorData.data.non_field_errors && <>
                <h5>Non field errors</h5>
                <ul>
                    {errorData.data.non_field_errors.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </>}
            {errorData && errorData.data && errorData.data.text && <>
                <h5>Text errors</h5>
                <ul>
                    {errorData.data.text.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </>}
        </Modal>
    )
}