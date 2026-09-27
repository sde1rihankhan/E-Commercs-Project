import OrderCard from "@/components/OrderCard.jsx";
import axios from "axios";
import React, { useEffect, useState } from "react";

const MyOrder = () => {

  const [userOrder, setUserOrder] = useState(null);

  const getUserOrders = async () => {
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
  };
  useEffect(() => {
    getUserOrders();
    console.log(userOrder);
  }, []);

  return (
   <>
      <OrderCard userOrder={userOrder}/>
   </>
  );
};

export default MyOrder;
