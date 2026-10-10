import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product
  );
  const selectedAddressData = addresses?.[selectedAddress];
  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true
  );
  // const [showForm, setShowForm] = useState(true);
  // useEffect(() => {
  //   setShowForm(!(addresses?.length > 0));
  // }, [addresses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Sabhi fields ko trim karo
    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );

    // Koi bhi field empty ho to save mat karo
    const hasEmptyField = Object.values(cleanedData).some((value) => !value);

    if (hasEmptyField) {
      toast.error("Please fill in all address fields");
      return;
    }

    // Same physical address pehle se saved hai ya nahi
    const normalize = (value) => value.trim().toLowerCase();

    const duplicateAddress = addresses.some((addr) =>
      ["address", "city", "state", "zip", "country"].every(
        (key) => normalize(addr[key] || "") === normalize(cleanedData[key])
      )
    );

    if (duplicateAddress) {
      toast.info("This address is already saved!");
      return;
    }

    // Save address and automatically select it
    dispatch(addAddress(cleanedData));
    dispatch(setSelectedAddress(addresses.length));

    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });

    setShowForm(false);
    toast.success("Address saved successfully!");
  };

  // const handleSave = () => {
  //   dispatch(addAddress(formData));
  //   setShowForm(false);
  // };
  //   console.log("addresses", addresses);
  // console.log("showForm", showForm);
  // console.log("store", useSelector((store) => store.product));

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const handelPayment = async () => {
    const accessToken = localStorage.getItem("accessToken"); // line 1: JWT token get

    try {
      const payload = {
        products: cart?.items?.map((item) => ({
          productId: item.productId?._id, // line 5: safe optional chaining
          quantity: item.quantity, // line 6: quantity send
        })),
        tax, // line 8: tax send
        shipping, // line 9: shipping send
        amount: total, // line 10: total amount send
        currency: "INR", // line 11: currency send
      };

      console.log("create order payload:", payload); // line 14: debug request body
      console.log("token:", accessToken); // line 15: debug token existence

      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/orders/create-order`, // line 18: correct API URL
        payload, // line 19: request body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // line 23: auth header
            "Content-Type": "application/json", // line 24: explicit JSON type
          },
        }
      );

      if (!data) return toast.error("Something went wrong"); // line 28: no response guard

      console.log("create order response:", data); // line 30: inspect backend response

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // line 33: razorpay public key
        amount: data.order.amount, // line 34: amount from backend
        currency: data.order.currency, // line 35: currency from backend
        order_id: data.order.id, // line 36: order id from backend
        name: "Ekart", // line 37: merchant name
        description: "Order payment", // line 38: payment description

        handler: async function (response) {
          try {
            const verifyResp = await axios.post(
              `${import.meta.env.VITE_URL}/api/orders/verify-payment`, // line 43: verify endpoint
              response, // line 44: razorpay callback response
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`, // line 47: auth header
                  "Content-Type": "application/json", // line 48: content type
                },
              }
            );

            if (verifyResp.data.success) {
              // Redux cart empty karo
              dispatch(setCart({ items: [], totalPrice: 0 }));

              // success notification
              toast.success("Payment Successful");

              // redirect user
              navigate("/order-success");
            } else {
              toast.error("Payment verification failed"); // line 57: verify failed
            }
          } catch (error) {
            console.error(
              "verify payment error:",
              error?.response?.data || error.message
            ); // line 60: verify error log
            toast.error("Error verifying payment"); // line 61: verify error toast
          }
        },

        modal: {
          ondismiss: async function () {
            try {
              await axios.post(
                `${import.meta.env.VITE_URL}/api/orders/verify-payment`, // line 68: dismiss endpoint
                {
                  razorpay_order_id: data.order.id, // line 70: cancelled order id
                  paymentFailed: true, // line 71: failure marker
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`, // line 75: auth header
                    "Content-Type": "application/json", // line 76: content type
                  },
                }
              );
            } catch (error) {
              console.error(
                "dismiss error:",
                error?.response?.data || error.message
              ); // line 80: dismiss debug
            }

            toast.error("Payment Cancelled or Failed"); // line 83: cancel toast
          },
        },

        prefill: {
          name: selectedAddressData?.fullName || "",
          email: selectedAddressData?.email || "",
          contact: selectedAddressData?.phone || "",
        },
        // prefill: {
        //   name: formData.fullName, // line 87: prefill name
        //   email: formData.email, // line 88: prefill email
        //   contact: formData.phone, // line 89: prefill phone
        // },

        theme: { color: "#F472B6" }, // line 92: theme color
      };

      const rzp = new window.Razorpay(options); // line 95: init razorpay

      rzp.on("payment.failed", async function (response) {
        try {
          await axios.post(
            `${import.meta.env.VITE_URL}/api/orders/verify-payment`, // line 99: failed payment endpoint
            {
              razorpay_order_id: data.order.id, // line 101: failed order id
              paymentFailed: true, // line 102: failed marker
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`, // line 106: auth header
                "Content-Type": "application/json", // line 107: content type
              },
            }
          );
          console.log(response);
        } catch (error) {
          console.error(
            "payment failed hook error:",
            error?.response?.data || error.message
          ); // line 111: failure debug
        }

        toast.error("Payment Failed. Please try again"); // line 114: failure toast
      });

      rzp.open(); // line 117: open payment popup
    } catch (error) {
      console.error(
        "create order error:",
        error?.response?.data || error.message
      ); // line 119: very important backend error log
      toast.error("Something went while processing payment"); // line 120: generic error toast
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid place-items-center p-10">
      <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto">
        <div className="space-y-4 p-6 bg-white">
          {showForm ? (
            <>
              <div>
                <p htmlFor="fullName">Full Name</p>
                <input
                  className="border p-1 rounded-lg w-full mt-1"
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <p htmlFor="phone">Phone Number</p>
                <input
                  className="border p-1 rounded-lg w-full mt-1"
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="+91 987654321"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <p htmlFor="email">Email</p>
                <input
                  className="border p-1 rounded-lg w-full mt-1"
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <p htmlFor="address">Address</p>
                <input
                  className="border p-1 rounded-lg w-full mt-1"
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p htmlFor="city">City</p>
                  <input
                    className="border p-1 rounded-lg mt-1"
                    type="text"
                    name="city"
                    id="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <p htmlFor="state">State</p>
                  <input
                    className="border p-1 rounded-lg mt-1"
                    type="text"
                    name="state"
                    id="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p htmlFor="zip">Zip Code</p>
                  <input
                    className="border p-1 rounded-lg mt-1"
                    type="text"
                    name="zip"
                    id="zip"
                    placeholder="Enter zip-code"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <p htmlFor="country">Country</p>
                  <input
                    className="border p-1 rounded-lg mt-1"
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                Save & Continue
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              {addresses.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => dispatch(setSelectedAddress(index))}
                  className={`border p-4 rounded-md cursor-pointer transition-colors ${
                    selectedAddress === index
                      ? "border-pink-600 bg-pink-50 ring-2 ring-pink-200"
                      : "border-gray-300 hover:border-pink-300"
                  }`}
                >
                  <p className="font-medium">{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.email}</p>
                  <p>
                    {addr.address}, {addr.city}, {addr.state},{addr.zip},{" "}
                    {addr.country}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deleteAddress(index));
                    }}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {/* {addresses.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => dispatch(setSelectedAddress(index))}
                  className={`border p-4 rounded-md cursor-pointer relative ${
                    selectedAddress === index
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-300"
                  }`}
                >
                  <p className="font-medium">{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.email}</p>
                  <p>
                    {addr.address} {addr.city} {addr.state} {addr.zip}{" "}
                    {addr.country}
                  </p>
                  <button
                    onClick={(e) => dispatch(deleteAddress(index))}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))} */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowForm(true)}
              >
                + Add New Address
              </Button>
              <Button
                onClick={handelPayment}
                disabled={selectedAddress === null || !cart?.items?.length}
                className="w-full bg-pink-600"
              >
                Proceed To Checkout
              </Button>
            </div>
          )}
        </div>
        {/* Right side order summary */}
        <div>
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length}) items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="text-sm text-muted-foreground p-4">
                <p>* Free shipping on order over 299</p>
                <p>* 10-days return policy</p>
                <p>* Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
