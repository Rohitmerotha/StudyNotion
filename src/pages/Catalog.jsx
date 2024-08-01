import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import {pageAndComponentData} from "../services/operations/pageAndComponentData"
import Course_Card from '../components/core/Catelog/Course_Card';
import { CourseSlider } from '../components/core/Catelog/CourseSlider';
import { useSelector } from 'react-redux';
import Error from './Error';

const Catalog = () => {
    const { loading } = useSelector((state) => state.profile)
const [active,setActive] = useState(1);
const {catalogName} = useParams();
const [ccatalogPageData,setCatalogPageData] = useState(null);
const [categoryId,setCategoryId] = useState("");
//fetch all category
console.log("first")
useEffect(()=>{
   const getCategories = async()=>{
        const res = await apiConnector("GET",categories.CATEGORIES_API);
        const  category_id = 
        res?.data?.data.filter((ct)=>ct.name.split(" ").join("-").toLowerCase()===catalogName)[0]._id
        setCategoryId(category_id);
   }
   getCategories()
},[catalogName]);

useEffect(()=>{
    const getCategoryDetails = async()=>{
        try{
            console.log("categoryId,,,,",categoryId)
            const res = await pageAndComponentData(categoryId);
            console.log("res....",res)
            setCatalogPageData(res)
        }
        catch(error){
            console.log(error)
        }
    }
    if(categoryId){
    getCategoryDetails();}
},[categoryId])

if (loading || !ccatalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!loading && !ccatalogPageData.success) {
    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <Error />
        </div>
      )
    
  }


  return (
    <div className='box-content bg-richblack-800 px-4'>
    <div className='flex min-h-[260px] w-11/12 max-w-maxContentTab flex-col mx-auto justify-center gap-4 lg:max-w-maxContent '>
        <p className='flex text-richblack-300'>{'Home / Catalog /'}
        <span className='text-yellow-50'>
            {ccatalogPageData?.data?.selectedCategory?.name}
        </span>
        </p>
        <p className='text-3xl text-richblack-5'>
        {ccatalogPageData?.data?.selectedCategory?.name}
        </p>
        <p className='max-w-[870px] text-richblack-200'>
        {ccatalogPageData?.data?.selectedCategory?.description}
        </p>
    </div>

    <div className='flex flex-col w-11/12  mx-auto gap-y-8'>
    {/* section1 */}
    <div className='flex flex-col gap-y-1 mt-5'>
    <div className='section_heading'>Courses to get you started</div>
    <div className='flex gap-x-3'>
        <p
        className={`px-4 py-2 ${
        active === 1 ? "border-b border-b-yellow-25 text-yellow-25": "text-richblack-50"} cursor-pointer`}
        onClick={() => setActive(1)}
        >Most Popular</p>
        <p
        className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
         onClick={() => setActive(2)}
        >New</p>
    </div>
    <div>
    <CourseSlider courses = {ccatalogPageData?.data?.selectedCategory?.courses}/>
    </div>
    
    </div>

    {/* section2 */}
    <div 
    className='mx-auto box-content w-full max-w-maxContentTab lg:max-w-maxContent px-4 py-12 '
    >
        <p className="section_heading"
        >Top Courses in 
        <span>{ccatalogPageData?.data?.selectedCategory?.name}</span>
        </p>
        <div className='py-8'>
            <CourseSlider courses = {ccatalogPageData?.data?.differentCategories?.courses}/>
        </div>
    </div>

    {/* section3 */}
    <div className='mx-auto box-content w-full max-w-maxContentTab lg:max-w-maxContent px-4 py-12'>
    <div className="section_heading">Frequently Bought</div>
    <div className='py-8'>
    <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-8'>
    {
        
        ccatalogPageData?.data?.mostSellingCourses
        ?.slice(0,4)
        .map((course,index)=>(
        <Course_Card course={course}  key={index} Height={"h-[300px]"}/>
        )

        )
    }

    </div>


    </div>
    </div>



    </div>
    
   <Footer/>
    </div>
  )
}

export default Catalog