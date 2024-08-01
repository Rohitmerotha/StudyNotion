import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import SubSectionModal from './SubSectionModal';
import { deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { deleteSection  } from '../../../../../services/operations/courseDetailsAPI';
import {setCourse} from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import {FaPlus} from "react-icons/fa"


const NestedView = ({handlChangeEditSectionName}) => {
  const {token} = useSelector((state)=>state.auth)
    const {course} = useSelector((state)=>state.course)
    const [addSubsection,setAddSubsection] = useState(null);
    const [viewSubsection,setViewSubsection] = useState(null);
    const [editSubsection,setEditSubsection] = useState(null);
    const [confirmationModal,setConfirmationModal] = useState(null);
    
    const dispatch= useDispatch();

    const handleDeleteSection = async(sectionId)=>{
      const result = await deleteSection({sectionId,
                                    courseId:course._id},
                                  token)
            if(result){
              dispatch(setCourse(result));
            }  
            setConfirmationModal(null);                 

    }

    const handleDeleteSubSection = async(subSectionId,sectionId)=>{
         const result = await deleteSubSection({subSectionId,sectionId},token);
         if(result){
          const updatedCourseContent  = course.courseContent.map((section)=>
          section._id === sectionId ? result :section);
          const updatedCourse = {...course,courseContent:updatedCourseContent}
          dispatch(setCourse(updatedCourse));
        }
        setConfirmationModal(null);
    }



  return (
    <div className=''>
    <div className="rounded-lg bg-richblack-700 p-6 px-8">
      {course?.courseContent?.map((section)=>(
          <details
          key={section._id} open>
          <summary 
          className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
           <div
           className='flex items-center gap-x-3'>
           <RxDropdownMenu className="text-2xl text-richblack-50"/>
           <p className="font-semibold text-richblack-50"
           >{section.sectionName}</p>
           </div>
          {/* {console.log("section _id",section._id,"section Name",section.sectionName)}` */}
           <div className='flex items-center gap-x-3'>
            <button
            onClick={()=>handlChangeEditSectionName(section._id,section.sectionName)}
            >
            <MdEdit className="text-xl text-richblack-300"/>
            </button>
            <button
            onClick={()=>{
              setConfirmationModal({
                text1:"Delete This Section",
                text2:"All the lectures in this section will kbe deleted",
                btn1Text:"Delete",
                btn2Text:"Cancel",
                btn1Handler:()=>handleDeleteSection(section._id),
                btn2Handler: ()=>setConfirmationModal(null),

              })
            }}>
             <RiDeleteBin6Line className="text-xl text-richblack-300"/>
            </button>

            <span className="font-medium text-richblack-300">|</span>

            <IoMdArrowDropdown
           className={`text-xl text-richblack-300`} />
           </div>
           

          </summary>

          <div className="px-6 pb-4">
            {
              section.subSection.map((data)=>(
                <div key={data._id}
                onClick={()=>setViewSubsection(data)}
                 className='flex items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2'
                >
                  <div
                  className='flex items-center gap-x-3 py-2'>
                  <RxDropdownMenu className="text-2xl text-richblack-50"/>
                  <p className="font-semibold text-richblack-50"
                   >{data.title}</p>
                  </div>

                  <div
                  onClick={(e)=>e.stopPropagation()}
                  className='flex items-center gap-x-3'>
                  <button
                  onClick={()=>setEditSubsection({...data,sectionId:section._id})}
                  >
                  <MdEdit className="text-xl text-richblack-300"/>
                  </button>

                  <button
                  onClick={()=>{
                  setConfirmationModal({
                text1:"Delete This Sub Section",
                text2:"selected lecture will be deleted",
                btn1Text:"Delete",
                btn2Text:"Cancel",
                btn1Handler:()=>handleDeleteSubSection(data._id,section._id),
                btn2Handler: ()=>setConfirmationModal(null),

              })
                  }}>
                  <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                  </button>

                  </div>

                </div>
              ))
            }

            <button
            onClick={()=>setAddSubsection(section._id)}
            className="mt-3 flex items-center gap-x-1 text-yellow-50"
            >
            <FaPlus className="text-lg" />
              <p>Add Lecture</p> 
            </button>
          </div>

          </details>
      ))}
    </div>

    {addSubsection ? (<SubSectionModal
      modalData = {addSubsection}
      setModalData = {setAddSubsection}
      add = {true}
    />) 
    : viewSubsection ? (<SubSectionModal
      modalData = {viewSubsection}
      setModalData = {setViewSubsection}
      view={true}
    />)
    : editSubsection ? (<SubSectionModal
      modalData = {editSubsection}
      setModalData = {setEditSubsection}
      edit={true}
    />)
    :(<div></div>)
    }

   {
    confirmationModal ? (
      <ConfirmationModal 
      modalData ={confirmationModal}
      setModalData = {setConfirmationModal}
      />
    ):(<div></div>)

   }


    </div>
  )
}

export default NestedView