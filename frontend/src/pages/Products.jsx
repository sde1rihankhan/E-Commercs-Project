import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { setProducts } from "@/redux/productSlice";
import axios, { all } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Products = () => {
  const {product} = useSelector(store=>store.product)
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [shortOrder, setShortOrder] = useState("")
  const dispatch = useDispatch();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(
        `${import.meta.env.VITE_URL}/api/product/getallproduct`
      );
      if (resp.data) {
        setAllProduct(resp.data.products);
        // console.log(resp.data.products);
        dispatch(setProducts(resp.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
//   console.log(allProduct);

useEffect(() => {
    if (allProduct.length === 0) return;
  
    let filtered = [...allProduct];
  
    if (search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
      // item ke andar category check karni hai
    }
  
    if (brand !== "All") {
      filtered = filtered.filter((item) => item.brand === brand);
      // item ke andar brand check karna hai
    }
  
    filtered = filtered.filter(
      (item) =>
        item.productPrice >= priceRange[0] &&
        item.productPrice <= priceRange[1]
    );
  
    if (shortOrder === "lowtoHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);

    } else if (shortOrder === "hightoLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }
  
    dispatch(setProducts(filtered));
  }, [search, category, brand, priceRange, shortOrder, allProduct, dispatch]);

  return (
    <div className="pt-20 pm-10">
      <div className="mx-20 flex gap-7">
        {/* sidebar */}
        <FilterSidebar
          allProducts={allProduct}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
        />
        {/* Main Product Section */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <select
              placeholder="Sort by Price"
              className="border-2 p-1 rounded-xl bg-gray-100"
              onChange={(e)=>setShortOrder(e.target.value)}
            >
              <option value="lowtoHigh">Price: Low to High</option>
              <option value="hightoLow">Price: High to Low</option>
            </select>
          </div>
          {/* product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {product.map((product) => {
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  loading={loading}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
