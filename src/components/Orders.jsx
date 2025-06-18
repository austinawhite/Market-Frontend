import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="orders">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id} style={{ marginBottom: '1rem' }}>
              <strong>Order #{order.id}</strong><br />
              Date: {new Date(order.order_date).toLocaleDateString()}<br />
              Total: ${order.total.toFixed(2)}<br />
              <ul>
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.quantity} × {item.book_title || `Book #${item.book_id}`} @ ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}