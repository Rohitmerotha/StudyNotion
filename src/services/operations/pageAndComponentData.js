import React from 'react'
import toast from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

export const pageAndComponentData = async(categoryId) => {
    const toastId = toast.loading("Loading...")
  let result = [];
  try{
    const response = await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,
        {categoryId:categoryId} )

    if(!response?.data?.success){
        throw new Error("Could not fetch Category page data");
    }  
    result = response?.data;



  }
  catch(error){
    console.log("Catalog page data Api Error...",error)
    // toast.error(error.message)

  }
  toast.dismiss(toastId)
  return result;
}
