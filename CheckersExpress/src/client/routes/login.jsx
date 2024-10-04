import {
    Form,
    redirect
} from "react-router-dom";

export async function login({ request }) {
    let formData = await request.formData();
    let intent = formData.get("intent");
    console.log("Sending ", formData.get("username"), "pw", formData.get("password"));
    let resource = (intent === "login") ? "/login" : "/register";
    const response = await fetch(resource, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.get("username"), password: formData.get("password") }),
    })
    if (response.status === 201) {
        console.log("good");
        return redirect("/browser");
    } else {
        console.log("bad");
    }
    return null;
}

export function LoginPage() {
    return (<>
        <Form id="login-form" method="post">
            <input placeholder="username" name="username" />
            <input placeholder="password" name="password" />
            <button type="submit" name="intent" value="register">Register</button>
            <button type="submit" name="intent" value="login">Log in</button>
        </Form>
    </>)
}