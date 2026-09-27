import razorpayInstance from "../config/razorpay.js";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import crypto from "crypto";
import { User } from "../models/userModels.js";
import Product from "../models/productModels.js";

export const createOrder = async (req, res) => {
  try {
    console.log("user:", req.user); // line 1: authenticated user check
    console.log("body:", req.body); // line 2: incoming payload check

    const { amount, currency, products, tax, shipping } = req.body; // line 4: body fields extract

    if (!amount || !currency || !products?.length) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields", // line 10: validation fail response
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // line 14: rupees to paise convert
      currency: currency || "INR", // line 15: default currency
      receipt: `receipt_${Date.now()}`, // line 16: unique receipt
    };

    console.log("razorpay options:", options); // line 19: outgoing order payload to razorpay

    const order = await razorpayInstance.orders.create(options);
    console.log("razorpay order:", order); // line 23: successful razorpay order response

    //Save order in DB
    const newOrder = new Order({
      user: req.user._id,
      products,
      amount,
      currency,
      tax,
      shipping,
      status: "Pending",
      razorpayOrderID: order.id,
    });
    await newOrder.save();

    return res.status(200).json({
      success: true,
      order: order,
      dbOrder: newOrder,
      // order, // line 28: send order to frontend
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error?.error?.description || error.message || "Order creation failed", // line 38: readable message
    });
  }
};

export const verifyPayment = async (req, resp) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;
    const userId = req.user._id;

    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderID: razorpay_order_id },
        { status: "Failed" },
        { new: true }
      );
      return resp.status(400).json({ message: "Payment Failed", order });
    }

    const sing = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sing.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderID: razorpay_order_id },
        {
          status: "Paid",
          razorpayPaymentID: razorpay_order_id,
          razorpaySignature: razorpay_signature,
        },
        { new: true }
      );
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalPrice: 0 } }
      );
      return resp.status(200).json({
        success: true, // frontend ke liye clear success flag
        message: "Payment Successful", // success message
        order, // updated order
      });
    } else {
      await Order.findOneAndUpdate(
        { razorpayOrderID: razorpay_order_id },
        { status: "faild" },
        { new: true }
      );
      return resp.status(400).json({ message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Error in verift payment", error);
    return resp.status(500).json({ message: error.message });
  }
};

export const getMyOrder = async (req, resp) => {
  try {
    const userId = req.id;
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email");

    resp.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user order:", error);
    resp.status(500).json({ message: error.message });
  }
};

//Only Admin
export const getUserOrders = async (req, resp) => {
  try {
    const { userId } = req.params; //userId will come from URL frontend

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      }) //Fetch product details
      .populate("user", "firstName lastName email"); //fetch user Info

    resp.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user order:", error);
    resp.status(500).json({
      message: error.message,
    });
  }
};

// Get All orders controller
export const getAllOrdersAdmin = async (req, resp) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email") //populate user Info
      .populate("products.productId", "productName ProductPrice"); //populate product Info

    resp.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Failed to fatech all orders",
      error: error.message,
    });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({}); // All User Count
    const totalProducts = await Product.countDocuments({}); // All Product Count
    const totalOrders = await Order.countDocuments({ status: "Paid" }); // All Orders Count only Paid Orders

    //Total Sales Amount
    const totalSaleAgg = await Order.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalSales = totalSaleAgg[0]?.total || 0;
    
    //Sales grouped by date (last 30 days)

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByDate = await Order.aggregate([
      { $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log(salesByDate);

    const formatedSales = salesByDate.map((item) => ({
      date: item._id,
      amount: item.amount,
    }));
    console.log(formatedSales);

    res.json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      sales: formatedSales,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
