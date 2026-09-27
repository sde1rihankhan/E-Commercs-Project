import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children, adminOnly = false}) => {
    const {user, loading} = useSelector((store)=>store.user)

    // console.log(useSelector((store) => store));


    if (loading) {
        return <div>Loading...</div>;
      }
    
    if(!user){
        return <Navigate to='/login'/>
    }
    if(adminOnly && user.role !== 'admin'){
        return <Navigate to='/'/>
    }

    return children
}

export default ProtectedRoute