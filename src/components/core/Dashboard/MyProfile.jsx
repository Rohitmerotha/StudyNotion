import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../common/IconBtn'

const MyProfile = () => {

    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate();
  return (
    <div className='text-white mx-auto lg:w-10/12 w-[500px] mt-5'>

        <h1 className='text-white font-semibold text-4xl mb-8'>
            My Profile
        </h1>
        
        {/* section 1 */}
        <div className='flex flex-row justify-between items-center p-5 bg-richblack-800 rounded-md mb-6 '>
            <div className='flex flex-row gap-4'>
                <img 
                src={user?.image}
                alt={`profile-${user?.firstName}`}
                className='aspect-square w-[58px] rounded-full object-cover' />
                <div className=' flex flex-col gap-1'>
                    <p className='font-semibold text-2xl'> {user?.firstName + " " + user?.lastName} </p>
                    <p className='text-richblack-50 text-sm'> {user?.email}</p>
                </div>
            </div>
            
            <IconBtn
                text="Edit"
                onclick={() => {
                    navigate("/dashboard/settings")
                }} 
                >
            </IconBtn>
           
           
        </div>

        {/* section 2 */}
        <div className='flex flex-row justify-between items-center p-6 bg-richblack-800 rounded-md mb-6'>
            <div className='flex flex-col gap-1'>
                <p className='font-semibold text-2xl'>About</p>
                <p className='text-richblack-50 text-sm'> {user?.additionalDetails?.about  ??  "Write Something about Yourself"}</p>
            </div>
            
            <IconBtn
                text="Edit"
                onclick={() => {
                    navigate("/dashboard/settings")
                }}  >
            </IconBtn>
           
            
        </div>

        {/* section 3 */}
        <div className='flex flex-col p-6 bg-richblack-800 rounded-md'>
            <div className='flex flex-row justify-between items-center'>
                <p className='font-semibold text-2xl'>Personal Details</p>
                
            <IconBtn
                text="Edit"
                onclick={() => {
                    navigate("/dashboard/settings")
                }}  >
            </IconBtn>
          
            </div>
            
            <div className='w-[70%] mt-10 flex flex-col lg:flex-row justify-between'>
            <div className='flex flex-col gap-y-4'>
            <div className='flex flex-col gap-y-1'>
                    <p className='text-richblack-500'>First Name</p>
                    <p>{user?.firstName}</p>
                </div>
                <div className='flex flex-col gap-y-1'>
                    <p className='text-richblack-500'>Email</p>
                    <p>{user?.email}</p>
                </div>
            
               
                <div className='flex flex-col gap-y-1'>
                    <p className='text-richblack-500'>Gender</p>
                    <p>{user?.additionalDetails?.gender ?? "Add Gender"}</p>
                </div>

                </div>
                <div className='flex flex-col gap-y-4'>
                <div className='flex flex-col gap-y-1'>
                    <p className='text-richblack-500'>Last Name</p>
                    <p>{user?.lastName}</p>
                </div>
                <div className='flex flex-col gap-y-1'>
                    <p className='text-richblack-500'>Phone Number</p>
                    <p>{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
                </div>
                <div className='flex flex-col gap-y-1'>
                    <p className='text-richblack-500'>Date of Birth</p>
                    <p>{user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}</p>
                </div>
                </div>
                
            </div>
        </div>

      
    </div>
  )
}

export default MyProfile
