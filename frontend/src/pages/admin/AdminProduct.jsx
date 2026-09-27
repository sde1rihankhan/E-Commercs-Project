import { Card } from "@/components/ui/card";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";
import axios from "axios";
import { setProducts } from "@/redux/productSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProduct = () => {
  const { product } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  // const [editPageOpen, setEditPageOpen] = useState(false)
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [shortOrder, setShortOrder] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  let filterProduct = product.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

    if(shortOrder === "lowtoHigh"){
      filterProduct = [...filterProduct].sort((a, b)=>a.productPrice - b.productPrice)
    } else if(shortOrder === "hightoLow"){
      filterProduct = [...filterProduct].sort((a, b)=> b.productPrice - a.productPrice)
    }
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("productName", editProduct.productName);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("brand", editProduct.brand);
    formData.append("category", editProduct.category);

    //add exisiting image public_ids
    const exisitingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);
    formData.append("exisitingImages", JSON.stringify(exisitingImages));

    //Add new file
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      const resp = await axios.put(
        `http://localhost:8000/api/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (resp.data) {
        toast.success("Product update Successfully");
        const updateProduct = product.map((p) =>
          p._id === editProduct._id ? resp.data.product : p
        );
        dispatch(setProducts(updateProduct));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const remainingProduct = product.filter(
      (product) => product._id !== productId
    );
    try {
      const resp = await axios.delete(
        `http://localhost:8000/api/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (resp.data) {
        toast.success(resp.data.message);
        dispatch(setProducts(remainingProduct));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pl-[350px] py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
      <div className="flex justify-between">
        <div className="relative bg-white rounded-lg">
          <input
            values={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search Product..."
            className="w-[400px] items-center p-2 rounded-lg"
          />
          <Search className="absolute right-3 top-1.5 text-gray-500" />
        </div>
        <select
          placeholder="Sort by Price"
          className="border-2 p-1 rounded-xl bg-white"
          onChange={(e) => setShortOrder(e.target.value)}
        >
          <option value="lowtoHigh">Price: Low to High</option>
          <option value="hightoLow">Price: High to Low</option>
        </select>
      </div>
      {filterProduct.map((product, index) => (
        <Card key={index} className="px-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <img src={product.productImg[0].url} className="w-25 h-25" />
              <h1 className="font-bold w-96 text-gray-800">
                {product.productName}
              </h1>
            </div>
            <h1 className="font-semibold text-gray-800">
              ₹{product.productPrice.toLocaleString("en-IN")}
            </h1>
            <div className="flex gap-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                  render={
                    <Button
                      onClick={() => {
                        setEditProduct(product), setOpen(true);
                      }}
                      className="bg-white cursor-pointer"
                    >
                      <Edit className="text-green-500 cursor-pointer" />
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                      Make changes to your product here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-2">
                    <div className="grid gap-2">
                      <label className="font-semibold">Product Name</label>
                      <input
                        value={editProduct?.productName}
                        onChange={handleChange}
                        type="text"
                        className="border rounded-sm p-1"
                        name="productName"
                        placeholder="Enter"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="font-semibold">Price</label>
                      <input
                        value={editProduct?.productPrice}
                        onChange={handleChange}
                        type="number"
                        className="border rounded-sm p-1"
                        name="productPrice"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="font-semibold">Brand</label>
                        <input
                          value={editProduct?.brand}
                          onChange={handleChange}
                          type="text"
                          className="border rounded-sm p-1"
                          name="brand"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="font-semibold">Category</label>
                        <input
                          value={editProduct?.category}
                          onChange={handleChange}
                          type="text"
                          className="border rounded-sm p-1"
                          name="category"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <label className="font-semibold">Description</label>
                      </div>
                      <textarea
                        value={editProduct?.productDesc}
                        onChange={handleChange}
                        name="description"
                        className="border p-2 rounded-lg"
                      />
                    </div>
                    <ImageUpload
                      productData={editProduct}
                      setProductData={setEditProduct}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose
                      render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button onClick={handleSave} type="submit">
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Trash2 className="text-red-500 cursor-pointer" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AdminProduct;
