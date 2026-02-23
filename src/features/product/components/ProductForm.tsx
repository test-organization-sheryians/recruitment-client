"use client"
import React, { useState } from 'react'
import { ProdcutService } from "../services/product.service"

export default function ProductForm(){
  const service = new ProdcutService()
  const [form, setForm] = useState({
    name:"",
     description: "",
    price: "",
    stock: "",
    category: "",
  })
  const handleSubmit = async(e:any)=>{
    e.preventDefault()
    await service.createProdcut({
      ...form,
      price:Number(form.price),
      stock:Number(form.stock)
    })
    alert("Product created....!!")
  }

  return(
    <form onSubmit={handleSubmit} className="'flex flex-col gap">
   <input placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} />
      <input placeholder="Description" onChange={(e) => setForm({...form, description: e.target.value})} />
      <input placeholder="Price" type="number" onChange={(e) => setForm({...form, price: e.target.value})} />
      <input placeholder="Stock" type="number" onChange={(e) => setForm({...form, stock: e.target.value})} />
      <input placeholder="Category" onChange={(e) => setForm({...form, category: e.target.value})} />
      <button type="submit">Create Product</button>


    </form>
  )
}