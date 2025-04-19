import React, { useState, useContext  } from "react";
import axios from "axios";
import "./Login.css";
import { useAuth }  from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const { isAuthenticated, login} = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
             // Create form data to send as 'application/x-www-form-urlencoded'
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const response = await axios.post(`${import.meta.env.VITE_API_URL}authentication/login`, 
                formData,
                {
                    headers: {"Content-Type": "application/x-www-form-urlencoded"} // is this necessary?
                }
               );

            login(response.data.access_token);
            navigate("/admin");
        } catch (err: any) {
            setError("Invalid username or password");
        }
    };

    if (isAuthenticated) {
        return <div>Logged in</div>;
      } else {
        return (
        
            <div className="login-div">
                <h2>Login</h2>
                <form className="login-form"
                 onSubmit={handleLogin}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        );
      }
};

export default Login;
