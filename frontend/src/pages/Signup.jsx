// import { toast } from "sonner";
// import { toast } from "@ /components/ui/toast"
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      setLoading(true);
      const resp = await axios.post(
        `${import.meta.env.VITE_URL}/api/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (resp.data) {
        navigate("/verify");
        toast.success(resp.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-50">
      <div className="bg-white p-5 rounded-3xl">
        <strong>Create your account</strong>
        <p className="text-gray-700">
          Enter given details below to create youe account
        </p>
        <div className="flex gap-5 mt-5">
          <div className="grid gap-1">
            <strong>FistName</strong>
            <input
              className="border-2 w-42 p-1 rounded-md"
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-1">
            <strong>LastName</strong>
            <input
              className="border-2 w-42 p-1 rounded-md"
              id="lastName"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid mt-3 gap-1">
          <strong>Email</strong>
          <input
            className="border-2 p-1 rounded-md"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid mt-3 gap-1">
          <strong>Password</strong>
          <div className="relative">
            <input
              className="border-2 p-1 rounded-md w-full"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              required
            />

            {showPassword ? (
              <Eye
                onClick={() => setShowPassword(false)}
                className="w-5 h-5 text-gray-700 absolute right-5 bottom-2"
              />
            ) : (
              <EyeOff
                onClick={() => setShowPassword(true)}
                className="w-5 h-5 text-gray-700 absolute right-5 bottom-2"
              />
            )}
          </div>
        </div>
        <div className="grid gap-3 mt-5">
          <button
            onClick={submitHandler}
            type="button"
            className="cursor-pointer bg-taupe-950 text-white p-1 rounded-md"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                Please wait
              </>
            ) : (
              "Signup"
            )}
          </button>
          <p className="text-gray-700 text-sm text-center">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="hover:underline cursor-pointer text-pink-800"
            >
              Login
            </Link>
          </p>
          {/* <button className="border p-1 rounded-md">Login with google</button> */}
        </div>
      </div>
    </div>
  );
};

export default Signup;
