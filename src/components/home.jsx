import { React, useEffect } from 'react'; 
import homepage from "../assets/images/homepage.png";
import logo from "../assets/images/logo.png";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();   

  useEffect(() => {
    document.body.classList.add('homepage');
    
    return () => {
      document.body.classList.remove('homepage');
    };
  }, []);

  const handleEnterClick = () => {
    navigate('/products');
  };

   const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (  
    <>
      <div className="homepage-main"> 
        <div className="homepage-image"> 
          <img src={homepage} alt="homepageimage" /> 
        </div>
          
        <div className="homepage-content"> 
            <img src={logo} alt="ourlogo" style={{maxWidth: '500px', height: 'auto'}}/>
            <h2>Welcome to Our Bookstore!</h2> 
            <p>Step through our enchanted digital doorway and discover books that sparkle with magic! 
            Here, every story is a treasure chest waiting to be opened, filled with talking animals, brave heroes, mysterious castles, and adventures that dance right off the page.</p>
            <button className="button-primary" onClick={handleEnterClick}>Browse Books</button>
            <button className="button-primary" onClick={handleLoginClick}>Login</button>
            <button className="button-primary" onClick={handleRegisterClick}>Register</button>
          </div>
        </div>
    
    </>
  );  
};  

export default Home;