import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");
  console.log("orders", orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_URL}/api/orders/all`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (data.orders) setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading all orders...
      </div>
    );
  }

  return (
    <div className="pl-[350px] py-20 pr-20 mx-auto px-4">
      <h1>Admin - All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order._id}</td>
                  <td className="px-4 py-2 border">
                    {order.user?.name}
                    <br />
                    <span className="text-sm text-gray-500">
                      {order.user.email}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    {order.products.map((product, id) => (
                      <div key={id} className="text-sm">
                        {product.productName} x {product.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border font-semibold">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-4 py-2 border text-sm font-medium ${
                        order.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >{order.status}</span>
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

// import React from 'react'
// import renderer from 'react-test-renderer'
// import { Provider } from 'react-redux'

// import store from '~/store'
// import { AdminOrders } from '../AdminOrders'

// describe('<AdminOrders />', () => {
//   const defaultProps = {}
//   const wrapper = renderer.create(
//     <Provider store={store}>
//      <AdminOrders {...defaultProps} />
//     </Provider>,
//   )

//   test('render', () => {
//     expect(wrapper).toMatchSnapshot()
//   })
// })
