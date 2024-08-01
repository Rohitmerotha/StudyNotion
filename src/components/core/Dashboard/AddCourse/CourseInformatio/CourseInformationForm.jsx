import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import {fetchCourseCategories} from "../../../../../services/operations/courseDetailsAPI"
import {HiOutlineCurrencyRupee } from "react-icons/hi"
import RequirementFiled from "./RequirementFiled"
import ChipInput from './ChipInput';
import {setStep} from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import {toast} from "react-hot-toast"
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import { addCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import Upload from '../CourseBuilder/Upload';

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValue,
    formState:{errors},
  } = useForm();

  const dispatch = useDispatch();
  const {token} = useSelector((state)=>state.auth)
  const {course,editCourse} = useSelector((state)=>state.course);
  const [loading,setLoading] = useState(false);
  const [courseCategories,setCourseCategories] = useState([]);
  useEffect(()=>{
    const getCategories = async()=>{
      setLoading(true);
     const categories = await fetchCourseCategories();
     console.log("category___",categories.length)
    if(categories.length > 0){
      setCourseCategories(categories);
    }
    setLoading(false);
    }
    console.log("courseCategories______",courseCategories)

    if(editCourse){
      setValue("courseTitle",course.courseName);
      setValue("courseShortDesc",course.courseDescription);
      setValue("coursePrice",course.price);
      setValue("courseTags",course.tag);
      setValue("courseBenefits",course.whatYouWillLearn);
      setValue("courseCategory",course.category);
      setValue("courseRequirements",course.instructions);
      setValue("courseImage",course.thumbnailImage);

    }
    getCategories();
  },[])

  const isFormUpdated = ()=>{
    const currentValues = getValue();
    if(currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnailImage 
      
    ){
      return true;
    }else{
      return false;
    }

  }

  const onSubmit = async(data)=>{
    if (editCourse) {
          // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValue();
        const formData = new FormData()
        console.log("data",data)
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          )
        }
        if (currentValues.courseImage !== course.thumbnailImage) {
          formData.append("thumbnailImage", data.courseImage)
        }
        console.log("Edit Form data: ", formData)
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return;
    }

    const formData = new FormData();
    formData.append("courseName", data.courseTitle)
    // console.log("Save Form data:1 ", formData)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    // formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)

  //   for (let [key, value] of formData.entries()) {
  //     console.log(`${key}: ${value}`);
  // }
    // console.log("Save Form data: ", formData)
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    // console.log("image",data.courseImage)
    setLoading(false)
  }
  


  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    className='rounded-md border-richblack-700
     bg-richblack-800 p-6 space-y-8'
    >
    <div className="flex flex-col space-y-2">
      <lable htmlFor='courseTitle'
      className='text-white'>
       Course Title<sup className="text-pink-200">*</sup>
      </lable>
      <input
        id='courseTitle'
        placeholder='Enter Course Title'
        {...register("courseTitle",{required:true})}
        className='form-style w-full'
      />
      {
        errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is Required</span>
        )
        }
        </div>
        <div>
          <label htmlFor='courseShortDesc'
          className='text-white'>Course Short Description<sup className='text-pink-200'>*</sup></label>
          <textarea
            id='courseShortDesc'
            placeholder='Enter Course Short Desc'
            {...register("courseShortDesc",{required:true})}
            className='form-style w-full'
          />
          {
            errors.courseShortDesc && (
              <span>Course Description Required</span>
            )
          }
          </div>
      <div className='relative'>
      <lable htmlFor='coursePrice'
      className='text-white'> Course Price<sup className='text-pink-200'>*</sup> </lable>
      <input
        id='coursePrice'
        placeholder='Enter Course Price'
        {...register("coursePrice",{
          required:true,
          valueAsNumber:true,
          
          })}
          className='form-style w-full !pl-12'
      />
      <div className=' font-bold text-4xl'>
      <HiOutlineCurrencyRupee className="absolute fixed left-1 top-7  text-4xl text-richblack-200"/>
      </div>
      {
      errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is Required</span>
        )
        }
        </div>
      <div>
        <label htmlFor='courseCategory'
        className='text-white'> Course Categories<sup className='text-pink-200'>*</sup></label>
        <select
        id='courseCategory'
        defaultValue=""
        {...register("courseCategory",{required:true})}
        className='form-style w-full'
        >
        <option value="" disabled>Choose a Category</option>
        {
          !loading && courseCategories.map((category,index)=>(
            <option key={index} value={category?._id}>
            {category?.name}
            </option>
          ))
        }
        </select>
        {
            errors.courseShortDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category Required</span>
            )
          }
      </div>

      {/* create a custom component for handling tag input */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Course Tags"
        register={register}
        errors ={errors}
        setValue = {setValue}
        getValue = {getValue}
      />

      {/* create a component for uploading and showing preview of media */}
      <Upload
      label="Course Thumbnail"
      name="courseImage"
      placeholder=""
      register = {register}
      errors ={errors}
      setValue = {setValue}
      editData={editCourse ? course?.thumbnail : null}
      />

      <div>
        <label htmlFor='courseBenefits'
        className='text-white'>Benefits of the Course<sup className='text-pink-200'>*</sup></label>
        <textarea
          id='courseBenefits'
          placeholder='Enter Benefits of the course'
          {...register("courseBenefits",{required:true})}
          className='form-style w-full'
        />

        {
            errors.courseBenefits && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Course Benefits Required</span>
            )
          }
      </div>

      <RequirementFiled
       name="courseRequirements"
       label="Requirements/Instructions"
       register={register}
       errors={errors}
       setValue={setValue}
       getValue={getValue}
      />
      
      <div>
        {
         editCourse && (
         <button
         onClick={()=>dispatch(setStep(2))}
         className='font-semibold flex items-center gap-x-2 bg-richblack-300'
         >
          Continue Without Saving
         </button>
         ) 
        }
        <IconBtn
        text = {!editCourse ? "Next" : "Save Changes"}        
         type='submit'
                />
      </div>





    </form>
  )
}

export default CourseInformationForm