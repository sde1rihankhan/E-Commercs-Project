import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: [],
  });
  const [loading, setloading] = useState(false)
  const [error, setError] = useState("");
  

  const fetchStats = async () => {
    try {
      setloading(true)
      setError("")
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(`${import.meta.env.VITE_URL}/api/orders/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.log(error);
      setError("Orders load nahi ho sake. Please try again.");
    }finally{
      setloading(false)
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return ( 
    
      <div className="pl-[350px] bg-gray-100 py-20 pr-20 mx-auto px-4">
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
        <div className="p-6 grid gap-6 lg:grid-cols-4">
        {/* Stats Card */}
        <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{stats.totalUsers}</CardContent>
        </Card>

        <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{stats.totalProducts}</CardContent>
        </Card>

        <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{stats.totalOrders}</CardContent>
        </Card>

        <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{stats.totalSales.toLocaleString("en-IN")}</CardContent>
        </Card>

          {/* Sales chart */}
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent style={{height:300}}>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={stats.sales}>
                <XAxis dataKey="date"/>
                  <YAxis/>
                    <Tooltip/>
                    <Area type="monotone" dataKey="amount" stroke="#F472B6" fill="#F472B6"/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
      )}
       
      </div>
  )
};

export default AdminSales;
