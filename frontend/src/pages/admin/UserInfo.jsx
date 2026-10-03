import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import userLogo from "../../assets/user.png";
import axios from "axios";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";

const UserInfo = () => {
  const navigate = useNavigate();
  // const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);
  const [file, setFile] = useState(null);
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch();

  const handleChange = (e) => {
    // setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    setUpdateUser((prev) => ({
      ...prev, // Keep previous state
      [name]: value, // Update only changed field
    }));
  };

  const handleFileChange = (e) => {
    const seletedFile = e.target.files[0];
    setFile(seletedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(seletedFile),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(updateUser);
    const accessToken = localStorage.getItem("accessToken");

    try {
      //use from data text + file
      setLoading(true);

      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("city", updateUser.city);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file); //image file for backend multer
      }
      const resp = await axios.put(
        `${import.meta.env.VITE_URL}/api/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );

      if (resp.data) {
        toast.success(resp.data.message); // Show success message
        dispatch(setUser(resp.data.user)); // Update Redux user
      }
    } catch (error) {
      console.log(error);
      toast.error("failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_URL}/api/user/get-user/${userId}`
      );
      if (resp.data) {
        setUpdateUser(resp.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
    // console.log(updateUser);
  }, []);

  return (
    <div className="pt-5 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="flex justify-between gap-4 ">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>
          </div>
          <div className="w-full flex gap-9 justify-between items-start px-7 max-w-2xl">
            {/* Profile picture */}
            <div className="flex flex-col items-center">
              <img
                src={updateUser?.profilePic || userLogo}
                className="w-25 h-25 rounded-full object-cover border-3 border-pink-700"
              />
              <label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-2xl hover:bg-pink-700">
                Change Picture{" "}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {/* profile form */}
            <form
              onSubmit={handleSubmit}
              // action=""
              className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="block text-sm font-medium">First Name</p>
                  {/* Issue clear hai.
                      Tum firstName input me ye use kar rahe ho:
                      value={updateUser?.firstName}
                      Agar updateUser?.firstName first render me undefined hai,
                      to uncontrolled input banta hai. Baad me value aati hai
                      to controlled ho jata hai, isliye warning aa rahi hai.
                      Fix:
                      value={updateUser?.firstName || ""} */}
                  <input
                    type="text"
                    name="firstName"
                    value={updateUser?.firstName || ""}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <p className="block text-sm font-medium">Lastst Name</p>
                  <input
                    type="text"
                    name="lastName"
                    value={updateUser?.lastName || ""}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div className="text-start">
                <p className="block text-sm font-medium">Email</p>
                <input
                  type="email"
                  name="email"
                  value={updateUser?.email || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="text-start">
                <p className="block text-sm font-medium">Phone Number</p>
                <input
                  type="text"
                  name="phoneNo"
                  value={updateUser?.phoneNo || ""}
                  onChange={handleChange}
                  placeholder="Enter your Contac Number"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="text-start">
                <p className="block text-sm font-medium">Address</p>
                <input
                  type="text"
                  name="address"
                  value={updateUser?.address || ""}
                  onChange={handleChange}
                  placeholder="Enter your Address"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-start">
                  <p className="block text-sm font-medium">City</p>
                  <input
                    type="text"
                    name="city"
                    value={updateUser?.city || ""}
                    onChange={handleChange}
                    placeholder="Enter your City"
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="text-start">
                  <p className="block text-sm font-medium">Zip Code</p>
                  <input
                    type="text"
                    name="zipCode"
                    value={updateUser?.zipCode || ""}
                    onChange={handleChange}
                    placeholder="Enter your Zip Code"
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <label className="block text-sm font-medium">Role :</label>
                <RadioGroup
                  value={updateUser?.role || "user"}
                  onValueChange={(value) =>
                    setUpdateUser({ ...updateUser, role: value })
                  }
                  className="flex items-center"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <label htmlFor="user">User</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <label htmlFor="admin">Admin</label>
                  </div>
                </RadioGroup>
              </div>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Please wait
                </>
              ) : (
                <button
                  type="submit"
                  className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg"
                >
                  Update Profile
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
