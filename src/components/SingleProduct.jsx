import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SingleProduct({ token, product, setProduct }) {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      const res = await fetch(`http://localhost:3000/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };

    getProduct();
  }, []);

  async function handleInstantPurchase() {
    try {
      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: 1,
          items: [
            {
              bookId: product.id,
              quantity: 1,
              price: product.price,
            },
          ],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/orders");
      } else {
        console.error(data);
        alert("Failed to place order.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order.");
    }
  }

  return (
    <>
      <h1>{product.title}</h1>
      <p>Description: {product.description}</p>
      <p>Price: ${product.price}</p>
      <div>
        {token && (
          <button onClick={handleInstantPurchase}>Purchase</button>
        )}
      </div>
    </>
  );
}

export default SingleProduct;

