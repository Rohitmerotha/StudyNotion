import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses'
import RenderTotalAmount from './RenderTotalAmount'
export default function Cart(){
const {totalItems,total} = useSelector((state)=>state.cart)
    return (
        <div className='text-white ml-8 mr-8'>
            <h1 className='text-[30px] text-white'>Your Cart</h1>
            <p className='text-richblack-500 text-sm '>{totalItems} Courses in Wishlist</p>
             {
                total>0 ?
                (
                    <div className='flex flex-col lg:flex-row justify-between 
                    border-t-[1px] border-richblack-500 mt-2'>
                    <RenderCartCourses/>
                    <RenderTotalAmount/>
                    </div>
                )
                :(
                    <div className='mt-14 text-center text-3xl text-richblack-100'>
                    Your Cart is Empty
                    </div>
                 
                )
             }

        </div>
    )
}