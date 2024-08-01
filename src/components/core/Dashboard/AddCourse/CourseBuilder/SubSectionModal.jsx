import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch,useSelector } from 'react-redux';
import {toast} from "react-hot-toast"
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import IconBtn from "../../../../common/IconBtn"
import Upload from './Upload';

const SubSectionModal = (
  {
    modalData,
    setModalData,
    add=false,view=false,edit=false,
  }
) => {

  const {register,handleSubmit,
    setValue,formState:{errors},getValues} = useForm();
    const [loading, setLoading] = useState(false)
    const dispatch= useDispatch();
    const {token} = useSelector((state)=>state.auth)
    const {course} = useSelector((state)=>state.course)
    
    useEffect(()=>{
      if(view || edit){
        setValue("lectureTitle",modalData.title);
        setValue("lectureDesc",modalData.description);
        setValue("lectureVideo",modalData.videoUrl);

      }
    })

    const isFormUpdate = ()=>{
       const currentVlaues = getValues();
       if(currentVlaues.lectureTitle !== modalData.title ||
        currentVlaues.lectureDesc !== modalData.description ||
        currentVlaues.lectureVideo !== modalData.videoUrl
       ){
        return true;
       }else{
        return false;
       }
    }

    const handleEditSubSection= async()=>{
      const currentVlaues = getValues();
      const formData = new FormData();
      formData.append("sectionId",modalData.sectionId);
      formData.append("subSectionId",modalData._id);
      if(currentVlaues.lectureTitle !== modalData.title){
        formData.append("title",currentVlaues.lectureTitle);
      }
      if(currentVlaues.lectureDesc !== modalData.description){
        formData.append("description",currentVlaues.lectureDesc);
      }
      if(currentVlaues.lectureVideo !== modalData.videoUrl){
        formData.append("video",currentVlaues.lectureVideo);
      }

      setLoading(true);
      const result = await updateSubSection(formData,token);
      if(result){

        const updatedCourseContent  = course.courseContent.map((section)=>
          section._id === modalData.sectionId ? result :section);
          const updatedCourse = {...course,courseContent:updatedCourseContent}
          dispatch(setCourse(updatedCourse));
        
        // dispatch(setCourse(result));
      }
      setModalData(null);
      setLoading(false);
     } 

    



   const onSubmit = async(data) => {
    if(view){
      return;
    }
    if(edit){
      if(!isFormUpdate){
        toast.error("No Changes Made to The Form")
      }else{
        handleEditSubSection();
      }
      return;
    }

    const formData = new FormData();
    formData.append("sectionId",modalData );
    formData.append("title",data.lectureTitle);
    formData.append("description",data.lectureDesc);
    formData.append("video",data.lectureVideo);
    setLoading(true);
    const result = await createSubSection(formData,token);
    if(result){
      const updatedCourseContent  = course.courseContent.map((section)=>
        section._id === modalData ? result :section);
        const updatedCourse = {...course,courseContent:updatedCourseContent}
        dispatch(setCourse(updatedCourse));

      // dispatch(setCourse(result));
    }
    setModalData(null);
    setLoading(false);
   } 


  return (

    <div>
    <div>
      <p>{view && "Viewing"} {add && "Adding"} {edit && "Editing"}</p>
      <button
      onClick={()=>(!loading ? setModalData(null):{})}
      >
        x
      </button>
    </div>
  <form
  onSubmit={handleSubmit(onSubmit)}
  >
  <Upload
   name = "lectureVideo"
   label = "Lecture Video"
   register ={register}
   setValue = {setValue}
   errors = {errors}
   video = {true}
   viewData = {view ? modalData.videoUrl : null}
   editData = {edit ? modalData.videoUrl : null}

  />

  {/* Lecture Title */}
  <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>


    {!view && (
      <div>
        <IconBtn
          text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
        />
      </div>
    )}



  </form>


    </div>
  )
}

export default SubSectionModal