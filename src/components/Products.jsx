import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Products({products, setProducts}) {
    
    useEffect(()=>{
        const getProducts = async () =>{
            const res = await fetch("http://localhost:3000/products")
        }
        getProducts();
        console.log(products)
    }, [])

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
                    <div>
                        <button>Details</button>
                    </div>
                </div>
            )
        }
    </>
    )
}

export default Products

