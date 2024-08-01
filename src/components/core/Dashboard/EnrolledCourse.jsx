import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileApi';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';

const EnrolledCourse = () => {
const {token} = useSelector((state)=>state.auth)
// console.log("ToKKen",token)
const [enrolledCourses,setEnrolledCourses] = useState(null);
const navigate = useNavigate()
const getEnrolledCourses = async()=>{
    try{
        const response = await getUserEnrolledCourses(token);
        // console.log("response,",response)
        setEnrolledCourses(response);
        // console.log("after response,",response)

    }
    catch(error){

        console.log("Unable to fetch Enrolled Course")
    }
}
useEffect(()=>{
    getEnrolledCourses();
    // console.log("EEEENrolled",enrolledCourses)
    
},[]);
console.log("EEEENrolled",enrolledCourses)
// console.log('course.courseContent?.[0]?.subSection?.[0]?._id', enrolledCourses[0].courseContent?.[0]?.subSection?.[0]?._id)
 
  return (
    <div className='text-white w-11/12 mx-auto'>
    <div className='text-4xl opacity-50'>Enrolled Course</div>
    {
        !enrolledCourses ? (
          <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
          <div className='spinner'></div>
        
          </div>
        ):
            !enrolledCourses.length ? (<p>You have not enrolled any courses</p>)
            :(
                <div className='my-8 text-richblack-5"'>
                    <div className="flex rounded-t-lg bg-richblack-500 ">
                        <p className="w-[45%] px-5 py-3">Course Name</p>
                        <p className="w-[45%] px-5 py-3">Durations</p>
                        <p className="w-[45%] px-5 py-3">Progress</p>
                    </div>
                 {/* card */}
                 {
                    enrolledCourses.map((course,index,arr)=>(
                        <div
                        className={`flex  items-center border border-richblack-700 ${
                             index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                           }`}
                        key={index}
                        >
                          <div
                          className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                          onClick={() => {
                           navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)
                          }}
                          >
                            <img src={course.thumbnail}
                             alt="course_img"
                             className="h-14 w-14 rounded-lg object-cover"
                            />
                            <div className='flex flex-col max-w-xs gap-2'>
                                <p className='font-semibold'>{course.courseName}</p>
                                <p className="text-xs text-richblack-300">
                                    {course.courseDescription.lenght > 50 
                                    ? `${course.courseDescription.slice(0,50)}....`
                                    : course.courseDescription
                                    }
                                </p>
                            </div>
                          </div>

                          <div className="w-1/4 px-2 py-3">
                            {course?.totalDuration}
                          </div>

                          <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                            <p>Progress:{course.progressPercentage || 0}%</p>
                            <ProgressBar
                            completed={course.progressPercentage}
                            height='8px'
                            isLabelVisible={false}/>

                          </div>

                        </div>
                    ))
                 }

                </div>
            )
         
    }

    </div>
  )
}

export default EnrolledCourse