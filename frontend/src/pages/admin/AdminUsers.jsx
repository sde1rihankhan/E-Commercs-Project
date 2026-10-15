import axios from "axios";
import { Edit, Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserLogo from "../../assets/user.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // console.log(users);

  const filteredUser = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAllUser = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const resp = await axios.get(
        `${import.meta.env.VITE_URL}/api/user/all-user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (resp.data) {
        setUsers(resp.data.users);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <div className="pl-[350px] py-20 pr-20 mx-auto px-4">
      <h1 className="font-bold text-2xl">User Management</h1>
      <p>View and manage registered user</p>

      <div className="flex relative w-[300px] mt-6">
        <Search className="absolute left-2 top-1 text-gray-600 w-5" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border pl-8 p-1 rounded-lg"
          placeholder="Search User..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-7">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-pink-100 p-5 rounded-lg">
              <div className="flex items-center gap-2">
                <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-5" />{" "}
                  <Skeleton className="w-full h-4" />{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex gap-3 mt-3">
                {" "}
                <Skeleton className="w-24 h-9 rounded-md" />{" "}
                <Skeleton className="w-32 h-9 rounded-md" />{" "}
              </div>{" "}
            </div>
          ))
        ) : filteredUser.length > 0 ? (
          filteredUser.map((user) => (
            <div key={user._id} className="bg-pink-100 p-5 rounded-lg">
              <div className="flex items-center gap-2">
                <img
                  src={user?.profilePic || UserLogo}
                  alt=""
                  className="rounded-full w-16 aspect-square object-cover border border-pink-600"
                />

                <div className="min-w-0">
                  <h1 className="font-semibold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <h3 className="break-all">{user.email}</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-3">
                <Button
                  onClick={() => navigate(`/dashboard/users/${user._id}`)}
                  variant="outline"
                >
                  <Edit />
                  Edit
                </Button>

                <Button
                  onClick={() =>
                    navigate(`/dashboard/users/orders/${user._id}`)
                  }
                >
                  <Eye />
                  Show Order
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-8">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
