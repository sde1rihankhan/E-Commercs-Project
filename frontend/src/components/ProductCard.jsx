import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";

const ProductCard = ({ product }) => {
  console.log(product);
  
  const { productImg, productPrice, productName } = product;

  const [addingToCart, setAddingToCart] = useState(false);

  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        toast.success("Product added to cart successfully!");
        dispatch(setCart(resp.data.cart));
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info("Product is already in your cart!");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add product to cart"
        );
      }

      console.error(error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-max">
      {" "}
      <div className="w-full aspect-square overflow-hidden">
        <img
          onClick={() => navigate(`/product/${product._id}`)}
          src={productImg?.[0]?.url}
          alt={productName}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
        />{" "}
      </div>
      <div className="px-2 space-y-1">
        <h1 className="font-semibold h-12 line-clamp-2">{productName}</h1>

        <h2 className="font-bold">₹{productPrice.toLocaleString("en-IN")}</h2>

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
    </div>
  );
};

export default ProductCard;
