import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import ImageUploade from "../../components/ImageUpload.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice.js";
import { Loader2 } from "lucide-react";

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const {products} = useSelector((store)=>store.product)
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: " ",
    productImg: [],
    brand: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("productImg", productData.productImg);
    formData.append("brand", productData.brand);
    formData.append("category", productData.category);

    if (productData.productImg === 0) {
      toast.error("Please select at least one image");
      return;
    }
    productData.productImg.forEach((img) => {
      formData.append("file", img);
    });

    try {
      setLoading(true);
      const resp = await axios.post(
        "http://localhost:8000/api/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      console.log("data",resp.data);
      // if (resp.data) {
      //   dispatch(setProducts([...products, resp.data.product]));
      //   toast.success(resp.data.message);
      // }
      if (resp.data?.product) {
        // check karo ki response me product exist karta hai
      
        dispatch(
          setProducts([
            ...(Array.isArray(products) ? products : []),
            // agar products array hai to usko spread karo
            // warna empty array use karo taaki iterable error na aaye
      
            resp.data.product,
            // naya product list me add karo
          ])
        );
      
        toast.success(resp.data.message);
        // success message show karo
      }
      
    } catch (error) {
      console.log(error);
      // console.log(error?.resp?.data);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pl-[350px] py-10 pr-20 mx-auto px-4 bg-gray-100">
      <Card className="w-full my-20">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Enter Product detalis below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="grid gap-2">
              <p className="font-bold">Product Name</p>
              <input
                type="text"
                value={productData.productName}
                onChange={handleChange}
                name="productName"
                placeholder="Enter"
                className="border rounded-sm p-1"
                required
              />
            </div>

            <div className="grid gap-2">
              <p className="font-bold">Price</p>
              <input
                value={productData.productPrice}
                onChange={handleChange}
                type="number"
                name="productPrice"
                placeholder=""
                className="border rounded-sm p-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <p className="font-bold">Brand</p>
                <input
                  value={productData.brand}
                  onChange={handleChange}
                  type="text"
                  name="brand"
                  placeholder="Enter"
                  className="border rounded-sm p-1"
                  required
                />
              </div>
              <div className="grid gap-2">
                <p className="font-bold">Category</p>
                <input
                  value={productData.category}
                  onChange={handleChange}
                  type="text"
                  name="category"
                  placeholder="Enter"
                  className="border rounded-sm p-1"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <p className="font-bold">Description</p>
              </div>
              {/* <input type='text' name='brand' placeholder='Enter' className='border' required/> */}
              <textarea
                name="productDesc"
                value={productData.productDesc}
                onChange={handleChange}
                placeholder="Enter brief description od product"
                className="border rounded-sm p-1"
              />
            </div>
            <ImageUploade
              productData={productData}
              setProductData={setProductData}
            />
          </div>
          <CardFooter className="flex-col gap-2">
            <Button
              disabled={loading}
              onClick={submitHandler}
              className="w-full mt-5 bg-pink-600 cursor-pointer"
              type="submit"
            >
              {loading ? (
                <span className="flex gap-1 items-center">
                  <Loader2 className="animate-spin" />
                  Please wait
                </span>
              ) : (
                "Add Product"
              )}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
