import React from "react";
import { Link } from "react-router-dom";
import shoppingCart from "../assets/grocery-store.png";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";
import { ShoppingCartIcon } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between">
        {/* info */}
        <div className="mb-6 md:mb-0">
          <div className="flex gap-2 items-center text-pink-500">
            <Link to={"/"}>
              {/* <img src={shoppingCart} className="w-8 text-pink-500" /> */}
              <ShoppingCartIcon/>
            </Link>
            <p className="font-semibold text-2xl">Kart</p>
          </div>

          <p className="mt-2 text-sm">
            Powering Your World with thr Best in Electronics.{" "}
          </p>
          <p className="mt-2 text-sm">
            123 Electronics St, style City, NY 10001
          </p>
          <p className="text-sm">Email: support@Zaptro.com</p>
          <p className="text-sm">Phone: (123) 456-7890</p>
        </div>
        {/* customer service link */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Customer Service</h3>
          <ul className="mt-2 text-sm space-y-2">
            <li>Contact Us</li>
            <li>Shipping & Returns</li>
            <li>FAQs</li>
            <li>Order Tracking</li>
            <li>Size Guide</li>
          </ul>
        </div>
        {/* social media links */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex space-x-3 mt-2">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaPinterest />
          </div>
        </div>
        {/* newsletter subscription */}
        <div>
          <h3 className="text-xl font-semibold">Stay in the Loop</h3>
          <p className="mt-2 text-sm">
            Subscribe to get special offers, Free giveaways, and more
          </p>
          <form action="" className="mt-4 flex">
            <input
              type="text"
              placeholder="your email address"
              className="w-full p-2 rounded-l-md bg-white text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-4 rounded-r-md hover:bg-red-700 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      {/* bottom section */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
        <p>
          &copy; <span className="text-pink-600">EKart</span>. All rights
          reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
