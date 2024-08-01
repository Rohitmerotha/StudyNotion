import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import RenderSteps from "../../Dashboard/AddCourse/RenderSteps"
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";

export default function EditCourse(){
   const dispatch = useDispatch();
   const {courseId} = useParams();
   const {course} = useSelector((state)=>state.course);
   const {token} = useSelector((state)=>state.auth);
   const [loading,setLoading] = useState(false);
   useEffect(()=>{
    const populateCourseDetails = async()=>{
        setLoading(true);
        const result=await getFullDetailsOfCourse(courseId,token);
        console.log("result?.courseDetails  ",result?.courseDetails)
        if(result?.courseDetails){
            dispatch(setEditCourse(true));
            dispatch(setCourse(result?.courseDetails))
        }
        setLoading(false)
    }
    populateCourseDetails();
   },[])



   if(loading){
    return (
        <div>Loading...</div>
    )
   }


    return (
        <div>
        <h1>Edit Course</h1>
        <div>
            {
                course ? (<RenderSteps/>) : (<p>Course Not Found</p>)
            }
        </div>

        </div>
    )
}