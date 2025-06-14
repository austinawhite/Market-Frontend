import {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom';

function LogIn({setToken}){
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('');

    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        try {
            const response = await fetch('http://localhost:3000/users', {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                username: username,
                password: password,
                }),
            });
      
            const result = await response.json();                  
            if (!response.ok) {
              throw new Error("Invalid credentials." || result.error);
            }
            setToken(result.token);
            navigate('/');
          } catch (error) {
            setError(error.message);
          }
        }

        return(
        <>
         <div className="login-container">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
            <label>
                Username: <input
                    name="username"
                    onChange={(e)=>setUsername(e.target.value)}
                    value={username}
                    required
                />
            </label>
            <label>
                Password: <input
                    name = "password"
                    onChange={(e)=>setPassword(e.target.value)}
                    value={password}
                    required
                />
            </label>
            <button className="login-button" type="submit">Login</button>
            <p><button><Link className="nav-link" to="/register">Register</Link> </button> if you don't have an account.</p>
        </form>
        </div>
        </>
        )
    
}
export default LogIn