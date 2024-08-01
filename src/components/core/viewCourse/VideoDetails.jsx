import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import {Player,BigPlayButton} from "video-react";
// import { BigPlayButton } from "react-icons/bi";
import IconBtn from '../../common/IconBtn';

import 'video-react/dist/video-react.css';
// import "node_modules/video-react/dist/video-react.css"; 
const VideoDetails = () => {

  const {courseId,sectionId,subSectionId} = useParams();
  const palyerRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {courseSectionData,courseEntireData,
    completedLectures} = useSelector((state)=>state.viewCourse);

    const {token} = useSelector((state)=>state.auth)
  const [videoData,setVideoData] = useState([]);
  const [videoEnded,setVideoEnded] = useState(false);
  const [loading,setLoading] = useState(false);

  // console.log('courseSectionData', courseSectionData)
  useEffect(()=>{
    ;(()=>{
      if(!courseSectionData.length){
        return;
      }
      if(!courseId && !sectionId && !subSectionId){
        navigate("/dashboard/enrolled-courses");
      }else{             
        
     const filteredData = courseSectionData.filter(
      (data)=>data._id === sectionId
     );
     const filteredVideoData = filteredData?.[0].subSection.filter(
      (data)=>data._id === subSectionId
     );
     setVideoData(filteredVideoData[0]);
     setVideoEnded(false);
        
      }
    })()
  },[courseSectionData,courseEntireData,location])

  const isFirstVideo =()=>{

 const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId)

const currentsubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
  (data)=>data._id === subSectionId
)

if(currentSectionIndex === 0 && currentsubSectionIndex===0){
  return true;
}else{
  return false;
}
  
}

  const isLastVideo = ()=>{
// const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId);

// const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length
// const currentsubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
//   (data)=>data._id === subSectionId
// )
// if(currentSectionIndex === courseSectionData.length-1 &&
//   currentsubSectionIndex === noOfSubSections-1
// ){
//   return true;
// }else{
// return false;
// }
const currentSectionIndx = courseSectionData.findIndex(
  (data) => data._id === sectionId
)

const noOfSubsections =
  courseSectionData[currentSectionIndx].subSection.length

const currentSubSectionIndx = courseSectionData[
  currentSectionIndx
].subSection.findIndex((data) => data._id === subSectionId)

if (
  currentSectionIndx === courseSectionData.length - 1 &&
  currentSubSectionIndx === noOfSubsections - 1
) {
  return true
} else {
  return false
}

}

  const goToNextVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId)

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length
    const currentsubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id === subSectionId
    )
    if(currentsubSectionIndex !== noOfSubSections-1){
        //seam section ki next video
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentsubSectionIndex + 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    }else{
      //different section ki first video
      // const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId)
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
      
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)

    }
  }

  const goToPrevVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId)

    // const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length
    const currentsubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id === subSectionId
    )

    if(currentsubSectionIndex !== 0){
      const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentsubSectionIndex-1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    }else{
      // const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId)
      const prevSectionId = courseSectionData[currentSectionIndex-1]._id;
      const noOfSubSection = courseSectionData[currentSectionIndex-1].subSection.length;
      const prevSubSection = courseSectionData[currentSectionIndex-1].subSection[noOfSubSection - 1]._id;
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSection}`)
    }

  }

  const handleLectureCompletion = async()=>{
    setLoading(true);
    const res = await markLectureAsComplete({courseId:courseId,subSectionId:subSectionId},token);
    if(res){
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);

  }

  return (
    <div className="relative flex flex-col gap-5 text-white">
    {
      !videoData ?
       (<div>
        No Data Found
      </div>):
      (
        <Player
        ref =  {palyerRef}
       aspectRatio="16:9"
        playsInline
        onEnded={()=>setVideoEnded(true)}
        src={videoData?.videoUrl}
        >
         <BigPlayButton position="center" />
         {
          videoEnded && (
            <div
            className='absolute  inset-0 z-[100] w-full grid gap-4 h-full place-content-center font-inter'
            >
              {
                !completedLectures.includes(subSectionId) 
                && (
                  <IconBtn
                    disabled={loading}
                    onclick={()=> handleLectureCompletion()}
                    text={!loading ? "Mark As Completed" : "Loading..."}
                    customClasses="text-xl"
                  />
                )
              }

              <IconBtn
                disabled={loading}
                onclick={()=>{
                  if(palyerRef?.current){
                    palyerRef?.current?.seek(0);
                    setVideoEnded(false);
                  }
                }}
                text="Rewatch"
                customClasses="text-xl"
              />
              <div
              className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl"
              >
              {
                !isFirstVideo()  && (
                  <button
                  disabled={loading}
                  onClick={goToPrevVideo}
                 className='cursor-pointer rounded-md bg-richblack-800 px-[20px] py-[8px] font-semibold text-richblack-5'
                  >
                    Prev
                  </button>
                )
              }
              {
                !isLastVideo() && (
                  <button
                  disabled={loading}
                  onClick={goToNextVideo}
                  className='cursor-pointer rounded-md bg-richblack-800 px-[20px] py-[8px] font-semibold text-richblack-5'
                 
                  >
                    Next
                  </button>
                )
              }

              </div>


            </div>

          )
         }

        </Player>


      )
    }
    <h1 className="bsolute mt-4 text-4xl font-semibold text-richblack-5">
      {videoData?.title} 
    </h1>
    <p
    className="pt-2 pb-6 text-richblack-300">
      {videoData.description}
    </p>

    </div>
  )
}

export default VideoDetails