 import { useState, useEffect } from "react";
 import { useParams, useNavigate } from "react-router-dom";

 function SingleProduct({token, product, setProduct}){

  const {id} = useParams()

        useEffect(()=>{
            const getProduct = async () =>{
              const res = await fetch(`http://localhost:3000/products/${id}`)
              const data = await res.json()       
              setProduct(data)
            }
        
            getProduct();
          },[])
       
    return(
        <>
        <h1>{product.title}</h1>
        <img src={product.image_url} alt={product.title} style={{ width: "200px" }} />
        <p>Description: {product.description}</p>
        <p>Price: {product.price}</p>
        <div>
          {token &&
        <button>Purchase</button>
          }
        </div>
        </>
    )
 }

 export default SingleProduct