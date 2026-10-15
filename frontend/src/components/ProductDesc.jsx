import { setCart } from "@/redux/productSlice";
import { Button } from "@base-ui/react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const ProductDesc = ({ product }) => {
  const accessToken = localStorage.getItem("accessToken");
  const [addingToCart, setAddingToCart] = useState(false);

  const dispatch = useDispatch();

  const addToCart = async (productId) => {
    try {
      setAddingToCart(true);
      const resp = await axios.post(
        `${import.meta.env.VITE_URL}/api/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (resp.data) {
        toast.success("Prodect added to Cart");
        dispatch(setCart(resp.data.cart));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl text-gray-800">
        {product.productName}
      </h1>
      <p className="text-gray-800">
        {product.category} | {product.brand}
      </p>
      <h2 className="text-pink-500 font-bold text-2xl">
        ₹{product.productPrice}
      </h2>
      <p className="line-clamp-10 text-muted-foreground">
        {product.productDesc}
      </p>
      <div className="flex gap-2 items-center w-[300px]">
        <p className="text-gray-800 font-semibold">Quantity :</p>
        <input type="number" className="w-14 border" defaultValue={1} />
      </div>
      <button
        onClick={() => addToCart(product._id)}
        disabled={addingToCart}
        className="bg-pink-600 mb-3 w-full text-white rounded-lg flex gap-2 justify-center items-center p-2 disabled:opacity-60"
      >
        {addingToCart ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
};

export default ProductDesc;
