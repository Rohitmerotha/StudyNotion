import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';
import toast from 'react-hot-toast';
const CourseBuilderForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors}
    } = useForm();
    
    const {token} = useSelector((state)=>state.auth)
    const {course} = useSelector((state)=>state.course)
    const [editSectionName,setEditSectionName] = useState(null);
    const [loading, setLoading] = useState(false)
    const dispatch= useDispatch();
    
   const goToBack = ()=>{
    dispatch(setStep(1));
    dispatch(setEditCourse(true))

   }
   const goToNext = ()=>{
      if(course?.courseContent?.length === 0){
        toast.error("Place add atleast one Section")
        return;
      }
      if(course.courseContent.some((section)=>section.subSection.length === 0)){
        toast.error("Place add atleast one Lecture in each Section")
        return;
      }

      dispatch(setStep(3));
   }
   const handlChangeEditSectionName = (sectionId,sectionName)=>{
    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }
    
    setEditSectionName(sectionId);
    setValue("sectionName",sectionName);
   
   }


    const cancelEdit = ()=>{
        setEditSectionName(null)
        setValue("sectionName","");
    }

    const onSubmit = async(data)=>{
       setLoading(true);
        let result;
       if(editSectionName){
        result = await updateSection(
            {
                sectionName:data.sectionName,
                sectionId:editSectionName,
                courseId: course._id
            },
            token
        )
       }else{
        result = await createSection({
            sectionName:data.sectionName,
            courseId:course._id
        },token)
       }

    

    if(result){
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName","");
    }
    setLoading(false)
    }

  return (
    <div className='flex flex-col gap-3'>
     <p className='text-4xl text-white'>Course Builder Form</p>
     <form 
     onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label htmlFor='sectionName' className='text-white'>Section Name<sup className='text-pink-200'>*</sup></label>
            <input
             id='sectionName'
             placeholder='Add Section Name'
             {...register("sectionName",{required:true})}
             className='w-full form-style'
            />
            {
                errors.sectionName && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200"
                    >Section Name Required</span>
                )
            }
        </div>
        <div className='mt-10 font-semibold'>
            <IconBtn
            type='submit'
            text={editSectionName ? "Edit Section Name":"Create Section"}
            outline={true}
            customClasses={"text-white"}
            >
            <CiCirclePlus className='text-yellow-50 text-lg'/>

            </IconBtn>
            {
             editSectionName ? (
                <button
                type='button'
                onClick={cancelEdit}
                className='text-sm text-richblack-300 underline'
                >
                    Cancel Button
                </button>
             ) :<div></div>
            }
        </div>

     </form> 
      
      {
        course?.courseContent?.length > 0 && (
            <NestedView handlChangeEditSectionName={handlChangeEditSectionName}/>
        )
      }
      <div 
      className='flex  lg:justify-end gap-x-3'>
        <button
        onClick={goToBack}
        className='rounded-md cursor-pointer py-4 px-8 flex items-center bg-richblack-700'
        >
            Back
        </button>
        <IconBtn
        text="Next"
        onclick={goToNext}
        customClasses="px-8 py-4"
        >

        </IconBtn>
      </div>


    </div>
  )
}

export default CourseBuilderForm