import {useState} from 'react'
import { useNavigate} from 'react-router-dom';

export default function LogIn({setToken}){
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('');

    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        try {
                    
            const response = await fetch('http://localhost:3000/users/login', {
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
         
        }
        catch (err) {
            setError('Invalid credentials. Please try again.');
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        </div>
        </>
        )
    
}