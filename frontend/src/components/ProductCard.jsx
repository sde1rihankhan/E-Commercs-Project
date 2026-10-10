import { ShoppingCart } from "lucide-react";
import React from "react";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    try {
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
    }
  };

  // const addToCart = async (productId) => {
  //   try {
  //     const resp = await axios.post(
  //       `${import.meta.env.VITE_URL}/api/cart/add`,
  //       { productId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     if (resp.data) {
  //       toast.success("Prodect added to Cart");
  //       dispatch(setCart(resp.data.cart));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-max">
      <div className="w-full h-full  aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : (
          <img
            onClick={() => navigate(`/product/${product._id}`)}
            src={productImg[0]?.url}
            alt=""
            className="w-full h-full transition-transform duration-300 hover:scale-105"
          />
        )}
      </div>
      {loading ? (
        <div className="px-2 space-y-2 my-2">
          <Skeleton className="w-50 h-4" />
          <Skeleton className="w-25 h-4" />
          <Skeleton className="w-37 h-4" />
        </div>
      ) : (
        <div className="px-2 space-y-1">
          <h1 className="font-semibold h-12 line-clamp-2">{productName}</h1>
          <h2 className="font-bold">₹{productPrice.toLocaleString("en-IN")}</h2>
          <button
            onClick={() => addToCart(product._id)}
            className="bg-pink-600 mb-3 w-full text-white rounded-lg flex gap-2 justify-center p-1"
          >
            <ShoppingCart className="w-5" />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
