'use client'
import AdminDashboard from "@/features/admin/Dashboard";
import { getCurrentUser } from "@/lib/auth";
import React, { useEffect } from "react";

const AdminHome = () => {
 
  return (
    <div>
      <AdminDashboard />
    </div>
  );
};
export default AdminHome;
