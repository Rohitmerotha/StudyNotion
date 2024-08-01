import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { useSelector } from 'react-redux';
import {IoIosArrowBack} from 'react-icons/io'
import {BsChevronDown} from 'react-icons/bs'

const VideoDetailsSidebar = ({setReviewModal}) => {
 const [activeStatus,setActiveStatus] = useState("");
 const [videobarActive,setVideobarActive] = useState("");
 const navigate = useNavigate();
 const {sectionId,subSectionId} = useParams();
 const location = useLocation();
 const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures
 } = useSelector((state)=>state.viewCourse)

 useEffect(()=>{
   const getactiveindex = ()=>{
        if(!courseSectionData.length){
            return;
        }
        const currentSectionIndex = courseSectionData.findIndex(
            (data)=>data._id === sectionId
        );
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
            (data)=> data._id === subSectionId)

        const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex]?._id;

        setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
        setVideobarActive(activeSubSectionId);

    }
    getactiveindex()
 },[courseSectionData ,courseEntireData,location.pathname])


  return (
    <>
    <div className='text-flex h-[calc(100vh-3.5rem)] w-[280px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800'>
    {/* for button and heading */}
        <div className='mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25'>
        {/* button */}
        <div className="flex w-full items-center gap-10 ">
        <div
        className='flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90'
        title='back'
        onClick={()=>navigate("/dashboard/enrolled-courses")}>
            <IoIosArrowBack size={30} />
        </div>
        <div>
            <IconBtn
                text="Add Review"

                onclick={()=>setReviewModal(true)}
            />
        </div>

        </div>
        {/* for heading or tital */}
        <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500"
            >{completedLectures.length} / {totalNoOfLectures}</p>
        </div>

        </div>

   {/* for section and subsection */}
   <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
    {
    courseSectionData.map((section,i)=>(
        <div
        onClick={()=>setActiveStatus(section?._id)}
        key={i}
        className="mt-2 cursor-pointer text-sm text-richblack-5"
        >
        {/* section */}
        <div
        className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
          <div className="w-[70%] font-semibold">
            {section?.sectionName}
          </div>
          {/* arr arrow icon here and handle rotate logic */}
          <div className="flex items-center gap-3">
          <span
          className={`${
          activeStatus === section?._id 
          ?"rotate-0"
          :"rotate-180"
          } transition-all duration-500`}
          >
          <BsChevronDown />
          </span>

          </div>

        </div>
        {/* subsection */}
        <div>
            {
            activeStatus === section?._id && (
                <div  className="transition-[height] duration-500 ease-in-out">
                    {
                        section.subSection.map((topic,i)=>(
                            <div 
                            className={`flex gap-3  px-5 py-2
                            ${videobarActive === topic._id 
                            ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"}`}
                            key={i}
                            onClick={()=>{
                                navigate(`/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${topic._id}`)
                                setVideobarActive(topic?._id);
                            }}
                            >
                                <input
                                    type='checkbox'
                                    checked={completedLectures.includes(topic._id)}
                                    onChange={()=>{}}
                                />

                                <span>
                                    {topic.title}
                                </span>
                            </div>

                        ))
                    }
                </div>
            )
            }
        </div>

        </div>

    )) 
    }
   </div>


    </div>

    </>
  )
}

export default VideoDetailsSidebar