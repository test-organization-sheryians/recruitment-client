"use client";
import React from 'react'
import { fetchProduct } from '../hooks/fetchproduct';

const FetchProducts = () => {
const {data,isLoading,error} = fetchProduct()
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  )
}

export default FetchProducts
