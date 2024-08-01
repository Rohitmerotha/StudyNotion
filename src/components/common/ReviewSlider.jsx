import React, { useEffect, useState } from 'react'
import { Swiper,SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {FreeMode,Navigation,Autoplay,Pagination} from 'swiper'
import ReactStars from "react-rating-stars-component"
import { ratingsEndpoints } from '../../services/apis'
import { apiConnector } from '../../services/apiconnector'
import { FaStar } from 'react-icons/fa'
const ReviewSlider = () => {
 
    const [reviews,setReviews] = useState([]);
    const truncateWords = 15;
    useEffect(()=>{
     const fetchAllReview = async()=>{
        const {data} =   await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API)
        // console.log('responseSlider', response)
        // const {data}= response;
        if(data?.success){
            setReviews(data?.data);
        }
      
     }
    fetchAllReview();
    // console.log('reviewsss..', reviews)
    },[])


  return (
    <div>
        <div className='h-[190px] max-w-maxContentTab lg:max-w-maxContent'>
          <Swiper
          slidesPerView={4}
          spaceBetween={24}
          loop={true}
          modules={[FreeMode,Pagination,Autoplay,Navigation]}
          freeMode={true}
          className='w-full'
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
            reviews.map((review,i)=>(
                <SwiperSlide
                
                key={i}>
                <div
                className=' lg:max-w-maxContent flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 rounded-md object-cover'>
                <div className='flex items-center  gap-x-3'>
                <img
                    src={review?.user?.image ?
                        review?.user?.image
                    :`https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                    alt='Review'
                    className='h-9 w-9 rounded-full object-cover'
                />

                <div className='flex flex-col'>
                
                 <p className='flex gap-x-2 font-semibold text-richblack-5'>
                 {`${review?.user?.firstName} ${review?.user?.lastName}`}</p>
                 
               
                
                <p className='text-[12px] font-medium text-richblack-500'>{review?.course?.courseName}</p>
                </div>
                </div>
                <div className="font-medium flex flex-wrap text-richblack-25">
                    {review?.review.split(" ").lenght > truncateWords
                    ? `${
                    review?.review.split(" ").slice(0,truncateWords).jion(" ")}...`
                    :`${review?.review}`
                    }
                </div>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold text-yellow-100' 
                    >{review?.rating.toFixed(1)}</p>
                    <ReactStars
                        count={5}
                        value={review?.rating}
                        size={24}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar/>}
                        fullIcon={<FaStar/>}
                        
                    />
                </div>
                
                </div>
                </SwiperSlide>
            ))
          }

          </Swiper>
        </div>
    </div>
  )
}

export default ReviewSlider