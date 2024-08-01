import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from "react-rating-stars-component"
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import { removeFromCart } from '../../../../slices/cartSlice';

const RenderCartCourses = () => {
    const {cart} = useSelector((state)=>state.cart)
    const dispatch = useDispatch();
  return (
    <div className='w-[80%] mt-4'>
    {
        cart.map((course,index)=>(
            <div className={`${index !== 0 ? "border-t-[1px] border-richblack-500": "border-non"} mt-2`}>
            <div key={index}
            className='flex justify-between mt-3'>
            <div className='flex gap-x-3'>
                <img src={course.thumbnail}
                    height={200}
                    width={180}
                    alt='course img'
                    className='rounded-md'
                />
                <div className='flex flex-col'>
                    <p className='text-white'>{course.courseName}</p>
                    <p className='text-richblack-500 text-sm' >{course.category?.name}</p>
                    <div className='flex items-center gap-x-1'>
                        <span className='text-yellow-50'>4.8</span>
                        <ReactStars
                            count={5}
                            size={20}
                            edit={false}
                            isHalf={true}
                            activeColor="#ffd700"
                            emptyIcon={<FaRegStar />}
                            halfIcon={<FaStarHalfAlt />}
                            fullIcon={<FaStar />}
                        />
                        <span className='text-richblack-500 text-sm' > {course.ratingAndReviews?.length} Ratings</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-y-2'>
                <button
                className='flex gap-x-1 items-center text-[#EF476F]'
                onClick={()=>dispatch(removeFromCart(course._id))}>
                <AiTwotoneDelete
                className='text-2xl' /><span className='text-lg'>Remove</span>
                </button>
                
                <p
                className='text-yellow-50 ml-2 text-lg'
                >Rs. {course.price}</p>
            </div>

            </div>
            </div>
        ))
    }
    </div>
  )
}

export default RenderCartCourses