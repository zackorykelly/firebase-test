// eslint-disable-next-line
import { useState } from "react";
// eslint-disable-next-line
import FirebaseAuthService from "../FirebaseAuthService";

function LoginForm({ existingUser }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await FirebaseAuthService.loginUser(username, password);
            setUsername("");
            setPassword("");
        }catch (error) {
            alert(error.message)
        }

    }

    async function handleLogout() {
        FirebaseAuthService.logout();
    }

    async function handleSendResetPasswordEmail() {
        if (!username) {
            alert("Missing username!")
            return;
        }
        try {
            await FirebaseAuthService.resetPassword(username);
            alert("Password reset email sent!");
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleLoginWithGoogle() {
        try {
            await FirebaseAuthService.loginWithGoogle();
        } catch (err) {
            alert(err.message)
        }
    }


    return (
        <div>
        {existingUser ? (
            <>
            <div>Welcome, {existingUser.email}</div>
            <button type="button" onClick={handleLogout}>Logout</button>
            </>
        ):(
            <form onSubmit={handleSubmit}>
                <label>Username (email): 
                    <input
                    id="username"
                    type={"email"}
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>Password: 
                <input
                    id="password"
                    type={"password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button>Login</button>
                <button type="button" onClick={handleSendResetPasswordEmail}>Reset Password</button>
                <button type="button" onClick={handleLoginWithGoogle}>Login With Google</button>
            </form>
        )}
        </div>
    );
}

export default LoginForm