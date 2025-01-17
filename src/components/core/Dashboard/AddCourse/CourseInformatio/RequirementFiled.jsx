import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
const RequirementFiled = ({name ,label,register,errors,setValue,getValues}) => {
   const [requirement,setRequirement] = useState("");
   const [requirementList,setRequirementList] = useState([]);
   const { editCourse, course } = useSelector((state) => state.course)

   useEffect(()=>{
    if (editCourse) {
      setRequirementList(course?.instructions)
    }
    register(name,{
      required:true,
      validate: (value)=>value.length>0
    })
   },[])

   useEffect(()=>{
    setValue(name,requirementList);
   },[requirementList])

   const handleAdd = ()=>{
    if(requirement){
      setRequirementList([...requirementList,requirement]);
      setRequirement("");
    }
   }

   const handleDelet = (index)=>{
    const updatedRequirementList = [...requirementList];
    updatedRequirementList.splice(index,1);
    setRequirementList(updatedRequirementList);
   }

  return (
    <div className="flex flex-col space-y-2">
    <label htmlFor={name} className='text-white'>
    {label} <sup sup className="text-pink-200">*</sup></label>
    <div className=" flex flex-col items-start space-y-2">
      <input
        type='text'
        id={name}
        value={requirement}
        placeholder="Enter  "
        onChange={(e)=>setRequirement(e.target.value)}
        className="form-style w-full"
        
      />
      <button
      type='button'
      onClick={handleAdd}
      className='font-semibold text-yellow-50'>
        Add
      </button>

    </div>
    {
      requirementList.length > 0 && (
        <ul>{
          requirementList.map((requirement,index)=>{
            return <li key={index}
            className="flex items-center text-richblack-5"
            >
            
            <span>{requirement}</span>
            {" "}
            <button
            type='button'
            className="ml-2 text-xs text-pure-greys-300 "
            onClick={()=>handleDelet(index)}>
           
            clear
            </button>
            </li>
             
          })}
        </ul>
      )
    }
    {
      errors[name] && (
        <span>
          {label} is required 
        </span> 
      )
    }

    </div>
  )
}

export default RequirementFiled