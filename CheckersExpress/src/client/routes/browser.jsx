import { Form } from "react-router-dom"

export default function Browser() {
    return (
        <>
            <h1>You're logged in probably!</h1>
            <Form method="post">
                <button type="submit">Log out</button>
            </Form>
        </>
    )
}