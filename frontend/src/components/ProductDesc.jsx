import { setCart } from '@/redux/productSlice';
import { Button } from '@base-ui/react'
import axios from 'axios';
import React from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const ProductDesc = ({product}) => {
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  const addToCart = async (productId) => {
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_URL}/api/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (resp.data) {
        toast.success("Prodect added to Cart");
        dispatch(setCart(resp.data.cart));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>
      <p className='text-gray-800'>{product.category} | {product.brand}</p>
      <h2 className='text-pink-500 font-bold text-2xl'>₹{product.productPrice}</h2>
      <p className='line-clamp-10 text-muted-foreground'>{product.productDesc}</p>
      <div className='flex gap-2 items-center w-[300px]'>
        <p className='text-gray-800 font-semibold'>Quantity :</p>
        <input type="number" className='w-14 border' defaultValue={1}/>
      </div>
      <Button onClick={()=>addToCart(product._id)} className="bg-pink-600 w-max p-1 rounded-sm text-white">Add to Cart</Button>
    </div>
  )
}

export default ProductDesc