import React, { useEffect } from "react";
import { Button } from "./ui/button";

const FilterSidebar = ({
  allProducts,
  priceRange,
  setPriceRange,
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
}) => {
  const Categories = allProducts.map((p) => p.category);
  const UniqueCategory = ["All", ...new Set(Categories)];
  // console.log(UniqueCategory);

  const Brands = allProducts.map((b) => b.brand);
  const UniqueBrand = ["All", ...new Set(Brands)];
  // console.log(UniqueBrand);

  const handleCategoryClick = (value) => {
    setCategory(value);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value]);
  };

  const resetFilters = () => {
    setSearch(""),
      setBrand("All"),
      setCategory("All"),
      setPriceRange([0, 999999]);
  };
  return (
    <div className="bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64">
      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        name=""
        id=""
        placeholder="Search"
        className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"
      />

      {/* Category */}
      <h1 className="mt-5 font-semibold text-xl">Category</h1>
      <div className="flex flex-col gap-2 mt-3">
        {UniqueCategory.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name=""
              id=""
              checked={category === item}
              onChange={() => handleCategoryClick(item)}
            />
            <label onClick={() => handleCategoryClick(item)}>{item}</label>
          </div>
        ))}
      </div>

      {/* Brands */}
      <h1 className="mt-5 font-semibold text-xl">Brands</h1>
      <select
        className="bg-white w-full p-2 border-gray-200 border-2 rounded-md"
        onChange={handleBrandChange}
      >
        {UniqueBrand.map((item, index) => (
          <option key={index} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Price range */}
      <h1 className="mt-5 font-semibold text-xl">Price Range</h1>
      <div className="flex flex-col gap-2 mt-3">
        <label>
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            max="5000"
            className="w-20 p-1 border border-gray-300 rounded"
            value={priceRange[0]}
            onChange={handleMinChange}
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            max="999999"
            className="w-20 p-1 border border-gray-300 rounded"
            value={priceRange[1]}
            onChange={handleMaxChange}
          />
        </div>
        <input
          type="range"
          min="0"
          max="5000"
          className="w-full"
          value={priceRange[0]}
          onChange={handleMinChange}
        />
        <input
          type="range"
          min="0"
          max="999999"
          className="w-full"
          value={priceRange[1]}
          onChange={handleMaxChange}
        />
      </div>

      {/* Reset Button */}
      <Button
        onClick={resetFilters}
        className="bg-pink-600 text-white mt-5 cursor-pointer w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
