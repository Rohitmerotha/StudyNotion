import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
const Course_Card = ({course,Height}) => {
    const [avgReviewCount,setAvgReviewCount] = useState(0);
    useEffect(()=>{
     const count = GetAvgRating(course.ratingAndReviews);
     setAvgReviewCount(count)
    },[course])


  return (
    <>
    <Link to={`/courses/${course._id}`}>
        <div className=''>
        <div className="rounded-lg">
        <img src={course?.thumbnail} alt='course'
            className= {`${Height}  w-[600px] rounded-xl object-cover`}
         
        />
        </div>

        <div className='flex flex-col gap-2 px-1 py-3'>
        <p className="text-xl text-richblack-5">{course.courseName}</p>
        <p className="text-sm text-richblack-50">{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
        <div className=' flex gap-x-3 items-center'>
        <span className='text-yellow-50'>{avgReviewCount || 0}</span>
        <RatingStars Review_count={avgReviewCount} 
        />
        <span
        className='text-sm text-richblack-400'
        >{course?.ratingAndReviews?.length} (Review Count)</span>
        </div>
        <p className='text-xl text-richblack-5'>Rs {course?.price}</p>
        </div>

        </div>
    </Link>
    
    </>
  )
}

export default Course_Card