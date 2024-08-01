import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import {ACCOUNT_TYPE} from "../../../utils/constants"
import { addToCart } from '../../../slices/cartSlice';

function CourseDetailsCard({course,setConfirmationModal,handleBuyCourse}){
    const{
        thumbnail:ThumbnailImage,
        price:currentPrice,
    }= course;
    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAddToCard = ()=>{
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("You are Instructor, you can't buy a course");
            return;
        }
        if(token){
            dispatch(addToCart(course));
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

    const handleShare = ()=>{
         copy(window.location.href);
         toast.success("Link Copy to clipboard")

    }


    return (
        <div className='flex flex-col gap-4 rounded-xl '>
            <img
                src={ThumbnailImage}
                alt=' ThumbnailImage'
                className='max-h-[300px] min-h-[180px] w-[350px] z-50 '
            />
            <div
            className='text-xl '
            >Rs.{currentPrice}</div>
            <div className='flex flex-col gap-y-6'>
                <button
                onClick={
                    user && course?.studentsEnrolled.includes(user?._id) 
                    ?()=>navigate("/dashboard/enrolled-courses") 
                    : handleBuyCourse
                }
                className='bg-yellow-50 p-4 w-[95%] font-semibold rounded-md mx-2'
                >
                    {
            user && course?.studentsEnrolled.includes(user?._id) ? "Go to Coursr"
            :"Buy Now"
                    }
                </button>
                
                {
                  (!course?.studentsEnrolled.includes(user?._id)) && (
                    <button
                    onClick={handleAddToCard}
                    className='bg-richblack-700 p-4 w-[95%] font-semibold rounded-md mx-2'>
                        Add to Card
                    </button>
                  )
                }

            </div>
            <div className='flex flex-col gap-2'>
                <p className='mx-auto text-sm text-richblack-300'>
                    30-Day Money Back Guarantee
                </p>
                <p>
                    This Course Include:
                </p>
                <div className='flex flex-col gap-y-3'>
                {
                     course?.instructions?.map((item,i)=>{
                       return <p key={i}
                       className='text-sm text-[#06D6A0]'
                       >
                       
                          {">> "}  <span>{item}</span>
                        </p>
                     })
                     }
                </div>
            </div>
            <div>
                <button 
                className='mx-auto flex items-center gap-2 p-6 text-yellow-50'
                onClick={handleShare}>
                    Share
                </button>
            </div>
        </div>


    );
}

export default CourseDetailsCard