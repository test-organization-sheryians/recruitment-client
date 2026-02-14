import RegisterForm from "@/features/client/components/RegisterClient";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Edit = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <div className="flex justify-center mt-10">
      <RegisterForm isEdit clientId={id} />
    </div>
  );
};

export default Edit;
