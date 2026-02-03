import { ICourse } from "@/types/Pcourse";
import { useCourseMutations } from "@/hooks/course/useCourses";

interface CourseCardProps {
    data: ICourse;
}

export const CourseCard = ({ data }: CourseCardProps) => {
    const { deleteMutation } = useCourseMutations();

    return (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-800">{data.title}</h3>
            <p className="text-gray-500 text-sm mt-2">{data.description}</p>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="font-bold text-green-600">₹{data.price}</span>
                <button 
                    onClick={() => deleteMutation.mutate(data._id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-500 text-sm font-semibold hover:underline"
                >
                    {deleteMutation.isPending ? "..." : "Delete"}
                </button>
            </div>
        </div>
    );
};