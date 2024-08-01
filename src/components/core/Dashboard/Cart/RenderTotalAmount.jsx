import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';
import { buyCourse } from '../../../../services/operations/studentFeaturesApi';
import { useNavigate } from 'react-router-dom';

const RenderTotalAmount = () => {
  const {token} = useSelector((state)=>state.auth);
  const {user} = useSelector((state)=>state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {total,cart} = useSelector((state)=>state.cart);
  const handleBuyCourse = ()=>{
    const courses = cart.map((course)=>course._id)
    buyCourse(token,courses,user,navigate,dispatch)
    console.log("Bought these courses",courses);
  }



  return (
    <div className='mt-4 bg-richblack-700 rounded-md p-4 w-[18%] flex flex-col gap-y-1'>
    <p className='text-richblack-500 text-sm'>Total:</p>
    <p className='text-yellow-50 text-lg'>Rs {total}</p>
    <p className='text-sm line-through text-richblack-500 '>Rs 7000</p>

    <IconBtn
   text="BUY NOW"
   onclick={handleBuyCourse}
   customClasses={"w-full justify-center"}

    />
    </div>
  )
}

export default RenderTotalAmount