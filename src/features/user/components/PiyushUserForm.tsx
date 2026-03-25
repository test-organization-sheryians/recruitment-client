"use client";

import { useForm } from "react-hook-form";
import LabelInput from "@/features/auth/components/LabelInput";
import {
  usePiyushCreateUser,
  usePiyushUpdateUser,
} from "../hooks/piyushUseUser";
import { useEffect } from "react";
import { PiyushUser } from "@/types/piyushUser";

type PiyushFormData = {
  name: string;
  email: string;
  password: string;
};

const PiyushUserForm = ({
  editUser,
  clearEdit,
}: {
  editUser: PiyushUser | null;
  clearEdit: () => void;
}) => {
  const { register, handleSubmit, reset } = useForm<PiyushFormData>();

  const { mutate: createUser, isPending } = usePiyushCreateUser();
  const { mutate: updateUser } = usePiyushUpdateUser();

  // 🔥 Prefill form when editing
  useEffect(() => {
    if (editUser) {
      reset({
        name: editUser.name,
        email: editUser.email,
        password: "",
      });
    }
  }, [editUser, reset]);

  const onSubmit = (data: PiyushFormData) => {
    if (editUser) {
      updateUser({
        id: editUser._id,
        data,
      });
      clearEdit();
    } else {
      createUser(data);
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2>{editUser ? "Update User" : "Create User"}</h2>

      <LabelInput
  label="Name"
  type="text"   // ✅ add this
  placeholder="Enter name"
  {...register("name", { required: true })}
/>

<LabelInput
  label="Email"
  type="email"
  placeholder="Enter email"
  {...register("email", { required: true })}
/>

<LabelInput
  label="Password"
  type="password"
  placeholder="Enter password"
  {...register("password")}
/>
      <button
  type="submit"
  disabled={isPending}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
>
  {isPending
    ? editUser
      ? "Updating..."
      : "Creating..."
    : editUser
    ? "Update User"
    : "Create User"}
</button>
    </form>
  );
};

export default PiyushUserForm;