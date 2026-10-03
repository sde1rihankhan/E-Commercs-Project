import React, { use } from "react";
import shoppingCart from "../assets/grocery-store.png";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button} from "@base-ui/react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
const Navbar = () => {
  const {user} = useSelector(store=>store.user)
  const {cart} = useSelector(store=>store.product)
  const accessToken = localStorage.getItem("accessToken")
  const admin = user?.role === 'admin' ? true : false
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () =>{
    try {
      const resp = await axios.post(`${import.meta.env.VITE_URL}/api/user/logout`,{},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      if(resp.data){
        dispatch(setUser(null))
        toast.success(resp.data.message)
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <>
      <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
        <div className=" max-w-11/12 mx-auto flex justify-between items-center py-3">
          {/* Logo section */}
          <div className="flex gap-1 items-center text-pink-500">
            <Link to={"/"}>
              <img src={shoppingCart} className="w-8" />
              {/* <ShoppingCart/> */}
            </Link>
            <p className="font-semibold text-3xl">Kart</p>
          </div>
          {/* nav section */}
          <nav className="flex gap-10 items-center">
            <ul className="flex gap-7 items-center text-xl font-semibold">
              <Link to={"/"}>
                <li>Home</li>
              </Link>
              <Link to={"/product"}>
                <li>Product</li>
              </Link>
              {user && (
                <Link to={`/profile/${user._id}`}>
                  <li>Hello {user.firstName}</li>
                </Link>
              )}
              {admin && (
                <Link to={`/dashboard/sales`}>
                  <li>Dashboard</li>
                </Link>
              )}
            </ul>
            <div>
              <Link to={"/cart"} className="relative">
                <ShoppingCart className=""/>
              </Link>
              <span className="bg-pink-500 ml-3 rounded-full absolute text-white top-2 px-2">
                  {cart?.items?.length || 0}
                </span>
            </div>

            {user ? (
              <Button onClick={logoutHandler} className="bg-pink-600 text-white cursor-pointer p-2 rounded-xl hover:bg-gray-800">
                Logout
              </Button>
            ) : (
              <Button onClick={()=>navigate("/login")} className="bg-linear-to-r from-cyan-500 to-blue-500 text-white cursor-pointer p-2 rounded-xl hover:bg-gray-800">
                Login
              </Button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
