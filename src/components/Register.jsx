import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('');

    async function handleSubmit(e){
        e.preventDefault();
        setError("");        

        try {
            const response = await fetch('http://localhost:3000/users/register', {
                mode: 'no-cors',
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
            if (response.ok) {
              navigate('/login');
            } else {
              setError("Failed to register" || result.error);
            }
          } catch (error) {
            console.error(error);
            setError(error.message);
          }
        }     
        
        return(
            <>
            <div className="register-container">
            <h2>Register</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username: <input 
                    value = {username}
                    required
                    onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password: <input 
                    type="password" 
                    value={password} 
                    minLength={4}
                    title="Your password must be at least 4 characters long."
                    required 
                    onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button className="register-button">Register</button>
            </form>
            </div>
            </>
          );
}
