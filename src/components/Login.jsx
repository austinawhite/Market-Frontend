import {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom';

function LogIn({setToken}){
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('');
    
}
export default LogIn