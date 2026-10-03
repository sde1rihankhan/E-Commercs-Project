import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
   const {token} = useParams()
   const [status, setStatus] = useState("Verifing...")
   const navigate = useNavigate()

   const verifyEmail = async() =>{
    try {
        const resp = await axios.post(`${import.meta.env.VITE_URL}/api/user/verify/`, {},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        if(resp.data){
            setStatus("✅ Email Verified Siccessfully")
            setTimeout(() => {
                navigate("/login")
            }, 2000);
        }
    } catch (error) {
        console.log(error);
        setStatus("Verfication failed. please try again")
    }
   }

   useEffect(() => {
        verifyEmail()
   }, [token])
   
  return (
    <div className='relative w-full h-full bg-pink-100 overflow-hidden'>
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md'>
                <h2 className='text-xl font-semibold text-gray-800'>{status}</h2>
            </div>
        </div>
    </div>
  )
}

export default VerifyEmail