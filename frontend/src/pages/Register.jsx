import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setLoading(true);
        try {
            await axios.post("/auth/register", { username, email, password });
            navigate("/login");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Registration failed, please try again later",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="card w-96 bg-base-100 card-lg  shadow-sm">
                <div className="card-body">
                    <p className="card-title">Register</p>

                    <input
                        type="text"
                        placeholder="Username"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="email"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleRegister} disabled={loading}>
                        {loading ? (
                            <>
                                <span className="loading loading-spinner mr-2" />
                                Registering...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                    <a className="link link-secondary" href="/login">
                        Already have an account?
                    </a>
                </div>
            </div>
        </div>
    );
}
export default Register;
