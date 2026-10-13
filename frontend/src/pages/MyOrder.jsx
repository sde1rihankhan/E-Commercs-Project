import OrderCard from "@/components/OrderCard.jsx";
import axios from "axios";
import React, { useEffect, useState } from "react";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUserOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(res.data);

      if (res.data) {
        setUserOrder(res.data.orders);
      }
    } catch (error) {
      console.error("Get orders error:", error);
      setError("Orders load nahi ho sake. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserOrders();
    console.log(userOrder);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={getUserOrders}
            className="rounded-md bg-pink-600 px-4 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      ) : (
        <OrderCard userOrder={userOrder} />
      )}
    </>
  );
};

export default MyOrder;
