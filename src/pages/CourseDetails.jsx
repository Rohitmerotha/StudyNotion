import React, { useEffect, useState } from 'react'
import { buyCourse } from '../services/operations/studentFeaturesApi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {fetchCourseDetails} from "../services/operations/courseDetailsAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"
import ConfirmationModal from "../components/common/ConfirmationModal"
import RatingStars from "../components/common/RatingStars"
import {formatDate} from "../services/formatDate"
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard'
import Footer from "../components/common/Footer"
import { TbWorld } from "react-icons/tb";
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar'
const CourseDetails = () => {
  const {courseId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user,loading} = useSelector((state)=>state.profile)
  const {token} = useSelector((state)=>state.auth);
  const {paymentLoading} = useSelector((state)=>state.course);
  const [courseData,setCourseData] = useState(null);
  const [avgReviewCount,setAvgReviewCount] = useState(0);
  const [totalNoOfLectures,setTotalNoOfLectures] = useState(0)
  const [confirmationModal,setConfirmationModal] = useState(null)
  const [isActive,setIsActive] = useState(Array(0))

  const handleActive = (id)=>{
    setIsActive(
      !isActive.includes(id)
      ? isActive.concat(id)
      :isActive.filter((e)=> e !== id)
    )
  }

  useEffect(()=>{
    const getCourseFullDetails = async()=>{
      try{
        const result = await fetchCourseDetails(courseId);
        console.log("courseData------ ", result);
        console.log('courseeName ====', result?.data?.courseDetails)
        setCourseData(result);

      }
      catch(error){
       console.log('Could not fetch course details')
      }
    }
    getCourseFullDetails();
    
  },[courseId])
  

  useEffect(()=>{
    const count = GetAvgRating(courseData?.data?.courseDetails?.ratingAndReviews);
    setAvgReviewCount(count);
  },[courseData]);

  useEffect(()=>{
    let lectures = 0;
    courseData?.data?.courseDetails?.courseContent?.forEach((sec)=>{
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures);

  },[courseData])



const handleBuyCourse = ()=>{
  if(token){
    buyCourse(token,[courseId],user,navigate,dispatch);
    return;
  }
  setConfirmationModal({
    text1:"You are not Login ",
    text2:"Please lonin to puchase the course",
    btn1Text:"Login",
    btn2Text:"Cancel",
    btn1Handler:()=>navigate("/login"),
    btn2Handler:()=>setConfirmationModal(null)
  }
  )

}

if(paymentLoading || !courseData){
  return(
    <div className='grid place-items-center min-h-[calc(100vh-3.5rem)]'>
      <div className='spinner'></div>   
    </div>
  )
}

if(!courseData.success){
  return(
    <Error/>
  )
}

const {
  _id:course_id,
  courseName,
  courseDescription,
  thumbnail,
  price,
  whatYouWillLearn,
  courseContent,
  ratingAndReviews,
  instructor,
  studentsEnrolled,
  createdAt
} = courseData?.data?.courseDetails;

//  console.log("course name",courseData.data.data.courseName)
  return (
    <div className='flex  flex-col w-full text-white'>
    <div className=' relative flex flex-col justify-start w-full bg-richblack-700 px-4 py-12'>

   

    <div className='w-[60%] ml-10 flex flex-col justify-center gap-4 text-lg text-richblack-5 z-10 py-5 my-5'>
    <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">{courseName}</p>
    <p className='text-richblack-200'>{courseDescription}</p>
    <div className='flex items-center flex-wrap text-md gap-x-2'>
      <span className="text-yellow-25">{avgReviewCount}</span>
      <RatingStars Review_count={avgReviewCount}/>
      <span>{`${ratingAndReviews.length || 0} Reviews`}</span>
      <span>{`${studentsEnrolled.length} student enrolled`}</span>
    </div>
    <div>
    <div>
    Created By
      {` ${instructor.firstName} `}{ `${instructor.lastName} `}
    </div>
    <div className='flex items-center gap-x-3 flex-wrap'>
    <p>Created at {formatDate(createdAt)}</p>
    <TbWorld/> {" "} English
    </div>
    </div>
    </div>

     {/* card */}
    <div 
    className='z-30 lg:absolute right-10 -bottom-[200px] bg-richblack-800 rounded-md sm:w-[350px]'>
      <CourseDetailsCard
        course={courseData.data.courseDetails}
        handleBuyCourse = {handleBuyCourse}
        setConfirmationModal = {setConfirmationModal}
      />
    </div>
    </div>
    <div className='w-[60%] ml-10'>

    <div
    className=' flex flex-col flex-wrap my-10'>
      <p className='text-5xl sm:text-4xl font-semibold'>What you will learn</p>
      <div className='text-richblack-300'>
        {whatYouWillLearn}
      </div>
    </div>


    <div>
    <div>
    <p className='text-5xl sm:text-4xl font-semibold'>Course Content</p>
    </div>

    <div className=' flex justify-between mt-10'>
    
    <div className=' flex text-sm text-richblack-300 items-center gap-x-3'>
    <span>{courseContent.length} Sections(s) </span>
      <span>
       {totalNoOfLectures} lectures
      </span>
      <span>
        {courseData.data.totalDuration} total duration
      </span>
    </div>

     <button
     onClick={()=>setIsActive([])}
     className='text-yellow-50 text-sm'>
      Collapse All Section
     </button> 

    </div>

    {/* Course Details Accordion */}
    <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>


    {/* Auth */}
    <div className="mb-12 py-4">
      <p className="text-[28px] font-semibold">Author</p>
      <div className="flex items-center gap-4 py-4">
        <img src={instructor.image}
        alt='aut'
        className="h-14 w-14 rounded-full object-cover"
        />
        <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
      </div>
      <p className="text-richblack-50">
                {instructor?.additionalDetails?.about}
              </p>
    </div>
     

    </div>

    </div>
    

    
    


      <Footer/>

    {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default CourseDetails