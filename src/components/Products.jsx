import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Products({products, setProducts}) {
    
    useEffect(()=>{
        const getProducts = async () =>{
            const res = await fetch("http://localhost:3000/products")
            const data = await res.json()

          setProducts(data);
        }
        getProducts();
        console.log(products)
    }, [])

    const navigate = useNavigate();

    const handleClick = (product) => {
          navigate(`/products/${product.id}`);
        };

return(
    <>
    <div>
        <h1>Welcome to our Children's Bookstore!</h1>
        <p>Please browse our current selection:</p>
    </div>
           {
            products.map((product)=>
                <div key={product.id}>
                    <h2>{product.title}</h2>
                    <h3>{product.description}</h3>
                    <h3>{product.price}</h3>
                    <div>
                        <button onClick={()=> handleClick(product)}>Details</button>
                    </div>
                </div>
            )
        }
    </>
    )
}

export default Products

