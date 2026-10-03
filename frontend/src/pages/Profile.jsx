// import { Tabs } from '@base-ui/react'
import React, { useState } from "react";
// import profile from "../assets/hero1_compressed.png";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/user.png";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/userSlice";
import { Loader2 } from "lucide-react";
import MyOrder from "./MyOrder";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId;
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    city: user?.city,
    address: user?.address,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic,
    role: user?.role,
  });

  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("city", updateUser.city)
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
            "Content-Type": "multipart/from-data",
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
    }finally{
      setLoading(false)
    }
  };
  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="overview" className=" mx-auto items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className=" flex flex-col justify-center text-center bg-gray-100">
            <p className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </p>
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
                    <input
                      type="text"
                      name="firstName"
                      value={updateUser.firstName}
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
                      value={updateUser.lastName}
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
                    value={updateUser.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="text-start">
                  <p className="block text-sm font-medium">Phone Number</p>
                  <input
                    type="text"
                    name="phoneNo"
                    value={updateUser.phoneNo}
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
                    value={updateUser.address}
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
                      value={updateUser.city}
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
                      value={updateUser.zipCode}
                      onChange={handleChange}
                      placeholder="Enter your Zip Code"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                </div>
                {
                  loading ? (
                    <>
                     <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                     Please wait
                    </>
                  ) : (
                    <button
                    type="submit"
                    className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg"
                  >
                    Update Profile
                  </button>
                  )
                }
               
              </form>
            </div>
          </div>
          {/* <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                View your key metrics and recent project activity. Track progress
                across all your active projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You have 12 active projects and 3 pending tasks.
            </CardContent>
          </Card> */}
        </TabsContent>
        <TabsContent value="orders">
          <MyOrder/>
        </TabsContent>
        {/* <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and download your detailed reports. Export data in
                multiple formats for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You have 5 reports ready and available to export.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and options. Customize your
                experience to fit your needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Configure notifications, security, and themes.
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Profile;

{
  /* <div className='max-w-7xl mx-auto items-center'> */
}
{
  /* <div>
    <p>Profile</p>
    <p>Orders</p>
    <div> */
}
{
  /* <div className='flex flex-col justify-center text-center bg-gray-100'>
            <p className='font-bold mb-7 text-2xl text-gray-800'>Update Profile</p>
            <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl'> */
}
{
  /* Profile picture */
}
{
  /* <div className='flex flex-col items-center'> */
}
{
  /* <img src={profile} className='w-25 h-25 rounded-full object-cover border-3 border-pink-700'/> */
}
{
  /* </div> */
}
{
  /* profile form */
}
{
  /* <form action=""></form> */
}
{
  /* </div> */
}
{
  /* </div> */
}
{
  /* </div> */
}
{
  /* </div> */
}
{
  /* // </div> */
}
