import React, { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {fetchInstructorCourses} from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"
import CoursesTable from './InstructorCourses/CoursesTable';

const MyCourses = () => {

    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [courses,setCourses] = useState([]);

    useEffect(()=>{
        const fetchCourses = async()=>{
         const result = await fetchInstructorCourses(token);
         if(result){
            setCourses(result);
         }
        }
        fetchCourses();
    },[])

  return (
    <div className='text-white'>
    <div className='flex justify-between'>
        <h1 className='text-4xl font-semibold ml-10'>My Courses</h1>
        <IconBtn
        onclick={()=>navigate("/dashboard/add-course")}
            text="Add Course"
        />
    </div>

    {
    courses && <CoursesTable courses={courses} setCourses={setCourses}/>
    }


    </div>
  )
}

export default MyCourses