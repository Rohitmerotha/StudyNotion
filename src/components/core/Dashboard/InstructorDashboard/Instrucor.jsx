import React, { useEffect, useState } from 'react'
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { useSelector } from 'react-redux';
import { getInstructoeData } from '../../../../services/operations/profileApi';
import { Link } from 'react-router-dom';
import InstructorChart from './InstructorChart';

const Instrucor = () => {

const {user} = useSelector((state)=>state.profile)  
const {token} = useSelector((state)=>state.auth)  
const [loading,setLoading] = useState(false);
const [courses,setCourses] = useState([]);
const [instructorData,setInstructorData] = useState(null);

useEffect(()=>{
const getCourseDataWithStats = async()=>{
    setLoading(true);
    const instructorApiData = await getInstructoeData(token);
    const result = await fetchInstructorCourses(token)
    console.log('InstructorApiData....', instructorApiData)
    console.log('Instructor course reponse...', result)
    if(instructorApiData.length){
        setInstructorData(instructorApiData);
    }
    if(result){
        setCourses(result);
    }
setLoading(false);
}
getCourseDataWithStats();
},[])

const totalAmount = instructorData?.reduce((acc,curr)=>acc+curr.totalAmountGenerated,0);
const totalStudents = instructorData?.reduce((acc,curr)=>acc+curr.totalStudentsEnrolled,0);




  return (
    <div className='text-white w-[85%] mx-auto'>
    <div className=' flex flex-col gap-y-2 mb-10'>
    <h1 className="text-2xl font-bold text-richblack-5">Hi {user.firstName} {user.lastName} 👋 👋</h1>
    <p className="font-medium text-richblack-200">Let's start something new</p>
    </div>
    {
        loading ? (
            <div className='grid place-items-center min-h-[calc(100vh-3.5rem)]'>
            <div className='spinner'></div>
            </div>
            )
        : courses.length > 0 
        ? (<div>
            <div className='flex lg:flex-row flex-col gap-4'>
            {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData} />
              ) : (
                <div className="flex-1 rounded-md bg-richblack-800 p-6">
                  <p className="text-lg font-bold text-richblack-5">Visualize</p>
                  <p className="mt-4 text-xl font-medium text-richblack-50">
                    Not Enough Data To Visualize
                  </p>
                </div>
              )}
                
                <div className="flex max-h-[300px] min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Statictics</p>
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">{courses.length}</p>
                </div>
                <div>
                    <p className="text-lg text-richblack-200">Total Students</p>
                    <p className="text-3xl font-semibold text-richblack-50">{totalStudents}</p>
                </div>
                <div>
                    <p className="text-lg text-richblack-200">Total Income</p>
                    <p className="text-3xl font-semibold text-richblack-50">Rs. {totalAmount}</p>
                </div>
                </div>
            </div>
            {/* courses */}
            <div className="rounded-md bg-richblack-800 p-6 mt-10">
            {/* Render 3 course */}
            <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                <Link to="/dashboard/my-courses">
                  <p className="text-xs font-semibold text-yellow-50">view all</p>
                </Link>  
            </div>
            <div className="my-4 flex items-start space-x-6  flex-wrap">
            {
            courses.slice(0,3).map((course,i)=>(
                <div key={i} className="lg:w-[30%] w-[70%]">
                  <img src={course.thumbnail} 
                  alt='course thumbnail'
                  className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50"
                     >{course.courseName}</p>
                    <div className="mt-1 flex items-center space-x-2">
                        <p className="text-xs font-medium text-richblack-300"
                        >
                            {course.studentsEnrolled.length} Students
                        </p>
                        <p className="text-xs font-medium text-richblack-300">|</p>
                        <p className="text-xs font-medium text-richblack-300">{course.price}</p>
                    </div>
                  </div>
                </div>
            ))
            }
            </div>

            </div>
        </div>
        )
        :(<div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
            <p className="text-center text-2xl font-bold text-richblack-5"
            >You have not Created any course yet</p>
            <Link
            to='dashboard/add-course'>
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
            Create a Course
            </p>
                
            </Link>
        </div>)
    }
   
    </div>
  )
}

export default Instrucor