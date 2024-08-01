import React from 'react'
import { Swiper,SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {FreeMode,Navigation,Autoplay,Pagination} from 'swiper'
import Course_Card from './Course_Card'


export const CourseSlider = ({courses}) => {
  return (
    <div>
    {
      courses?.length ? (
        <Swiper
        spaceBetween={50}
        slidesPerView={2}
        pagination={true}
        modules={[Pagination,Autoplay,Navigation]}
        className="max-h-[30rem]"
        autoplay={{
          delay:1000,
          disableOnInteraction:false,
        }}
        navigation={true}
        breakpoints={{
          1024:{slidesPerView:3}
        }}
       
       
        >
        {
          courses?.map((course,index)=>(
            <SwiperSlide
            key={index}>
              <Course_Card course={course} Height={"h-[250px]"}/>
            </SwiperSlide>
          ))
        }

        </Swiper>
      ):
      (<p className="text-xl text-richblack-5">No Course Found</p>)
    }
    </div>
  )
}
