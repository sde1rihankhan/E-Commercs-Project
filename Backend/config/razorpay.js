import dotenv from "dotenv"; // line 1: dotenv import
import Razorpay from "razorpay"; // line 1: razorpay package import

dotenv.config(); 
// stop server early if env values are missing
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys are missing in .env");
}
console.log(process.env.RAZORPAY_KEY_ID?.trim());
console.log(process.env.RAZORPAY_KEY_SECRET?.trim());

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID?.trim(), // line 1: accidental spaces remove
    key_secret: process.env.RAZORPAY_KEY_SECRET?.trim(), // line 2: accidental spaces remove
  });
  // console.log(razorpayInstance);
  

export default razorpayInstance; // line 8: export instance
