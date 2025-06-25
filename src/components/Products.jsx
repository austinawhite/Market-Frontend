import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Products({products, setProducts}) {

    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    
    useEffect(()=>{
        const getProducts = async () =>{
            const res = await fetch("http://localhost:3000/products")
            const data = await res.json()

          setAllProducts(data)  
          setProducts(data);
        }
        getProducts();
    }, [])

    const navigate = useNavigate();

    const handleClick = (product) => {
          navigate(`/products/${product.id}`);
        };

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
          
        const results = allProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(results);
        };

      const handleClear = () => {
            setSearchTerm('');
            setProducts(allProducts);
          };    
         
      useEffect(() => {
            if (location.pathname === '/products') {
              setProducts(allProducts); 
              setSearchTerm('');
            }
          }, [location]);

return(
    <>
    <div>
        <h1>Welcome to our Children's Bookstore!</h1>
        <p>Please browse our current selection or search for a book below:</p>
        <div>  
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            />
        </div>
        <div>
          <button onClick={handleClear}>Reset</button>
        </div> 
    </div >
    <div className="books">
           {
            products.map((product)=>
                <div key={product.id} className="books-card">
                    <h2>{product.title}</h2>
                    <img src={product.image_url} alt={product.title} style={{ width: "200px" }} />
                    <h3>{product.price}</h3>
                    <div>
                        <button onClick={()=> handleClick(product)}>Details</button>
                    </div>
                </div>
            )
        }
    </div>
    </>
    )
}

export default Products

