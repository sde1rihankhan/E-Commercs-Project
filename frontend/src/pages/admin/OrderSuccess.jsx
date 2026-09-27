import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mt-6 text-gray-800">
          Payment Successful 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 mt-2">
          Thank you for your purchase! your order has been placed Successfully.
        </p>

        {/* Button */}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={()=> navigate('/product')}
            className="w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition">
            Continue Shopping
          </Button>
          
          <Button
            variant="outline"
            onClick={()=> navigate('/dashboard/orders')}
            className="w-full border border-pink-600 text-pink-600 py-3 rounded-xl hover:bg-pink-50 transition">
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
