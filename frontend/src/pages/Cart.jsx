import React from "react";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/user.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  console.log(cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const subTotal = cart?.totalPrice;
  const shipping = subTotal > 299 ? 0 : 10;
  const tex = subTotal * 0.05; //5%
  const total = subTotal + shipping + tex;

  const API = "http://localhost:8000/api/cart";
  const accessToken = localStorage.getItem("accessToken");

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const resp = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (resp.data) {
        dispatch(setCart(resp.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const resp = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId },
      });
      
      console.log(resp);
      if (resp.data) {
        dispatch(setCart(resp.data.cart));
        toast.success("Product remove from cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">
            Shopping Cart
          </h1>
          <div className="max-w-7xl mx-auto flex gap-7">
            <div className="flex flex-col gap-7 flex-1">
              {cart?.items?.map((product, index) => (
                <Card key={index}>
                  <div className="flex justify-between items-center pr-7">
                    <div className="flex items-center w-80">
                      <img
                        src={
                          product?.productId?.productImg?.[0]?.url || userLogo
                        }
                        className="w-25 h-25 p-1"
                      />
                      <div className="w-70">
                        <h1 className="font-semibold truncate">
                          {product?.productId?.productName}
                        </h1>
                        <p className="font-semibold">
                          ₹{product?.productId?.productPrice}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-5 items-center">
                      <Button
                        onClick={() =>
                          handleUpdateQuantity(
                            product.productId._id,
                            "decrease"
                          )
                        }
                        variant="outline"
                      >
                        -
                      </Button>
                      <p>{product.quantity}</p>
                      <Button
                        onClick={() =>
                          handleUpdateQuantity(
                            product.productId._id,
                            "increase"
                          )
                        }
                        variant="outline"
                      >
                        +
                      </Button>
                    </div>
                    <p>
                      ₹{product?.productId?.productPrice * product?.quantity}
                    </p>
                    <p
                      onClick={() => handleRemove(product?.productId?._id)}
                      className="flex text-red-500 items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            <div>
              <Card className="w-100">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart?.items.length} items)</span>
                    <span>₹{cart?.totalPrice?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tex(5%)</span>
                    <span>₹{tex}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="flex space-x-2">
                      <input
                        className="w-full border rounded-xl p-2"
                        placeholder="Promo Code"
                      />
                      <Button variant="outline">Apply</Button>
                    </div>
                    <Button onClick={()=>navigate('/address')} className="w-full bg-pink-600">PLACE ORDER</Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Link to="/product">Continue Shopping</Link>
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground pt-4">
                    <p>* Free shipping on order over 299</p>
                    <p>* 10-days return policy</p>
                    <p>* Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          {/* Icon */}
          <div className="bg-pink-100 p-6 rounded-full">
            <ShoppingCart className="w-16 h-16 text-pink-600" />
          </div>
          {/* title */}
          <h2 className="mt-6 text-2xl font-bold text-gray-800">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-gray-600">
            Look like your haven't added anything to your cart yet
          </p>
          <Button
            onClick={() => navigate("/product")}
            className="mt-6 cursor-pointer bg-pink-600 text-white py-3 px-6 hover:bg-pink-700"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
