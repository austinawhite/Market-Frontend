import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Account({ token }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function getUser() {
      try {
        const result = await fetch(`http://localhost:3000/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await result.json();
        setUser(data);
      } catch (error) {
        console.error("Error loading user details: ", error);
      }
    }
    getUser();
  }, []);

   return(
    <>
    <div className="account-container">
     {user ? (
    <>
      <h1>Account Details</h1>
      <h3>Username: {user.username} </h3>
      <h4>Token: {token} </h4>
      <h1>Orders</h1>
      <h1>Reviews</h1>
    </>
  ) : (
    <p>Loading account details...</p>
  )}
</div>
</>
)
}