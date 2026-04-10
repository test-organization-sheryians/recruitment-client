"use client"
import { useShareCandidates } from "../hooks/useShareuser";


const UserDetails = ({ id }: { id: string }) => {
    const { data, isLoading, error } = useShareCandidates(id);
    console.log(data);
    
  return (
   <div>hi</div>
  );
};

export default UserDetails;
