import Breadcrums from "@/components/Breadcrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
// //    // URL params ko access kar rahe hain
// //   const params = useParams();
// //   // id ko params se le rahe hain
// //   const productId = params.id;
//    // redux store se product state le rahe hain
//   const { products } = useSelector((store) => store.product.product);
//   // safe way me product find kar rahe hain
//   const product = (products || []).find((item) => item._id === productId);
//   console.log(useSelector((store) => store));

// URL params se id nikal rahe hain
const { id } = useParams();

// Redux store se product slice nikal rahe hain
const productState = useSelector((store) => store.product);

// product array ko safely access kar rahe hain
const products = productState?.product || [];

// id ke basis par matching product find kar rahe hain
const singleProduct = products.find((item) => item._id === id);

// console check
// console.log("id:", id);
// console.log("products:", products);
// console.log("singleProduct:", singleProduct);


  return (
    <div className="pt-20 py-10 max-w-7xl mx-auto">
      <Breadcrums singleProduct={singleProduct} />
      <div className="mt-10 grid grid-cols-2 items-center">
        <ProductImg images={singleProduct.productImg}/>
        <ProductDesc product={singleProduct} />
      </div>
    </div>
  );
};

export default SingleProduct;
