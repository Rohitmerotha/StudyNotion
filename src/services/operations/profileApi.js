
import {toast} from "react-hot-toast"
import { profileEndpoints } from '../apis'
import { apiConnector } from '../apiconnector';
import { setLoading } from "../../slices/profileSlice";
import { setUser } from "../../slices/profileSlice";
import {logout} from "./authAPI"

const {GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
    GET_INSTRUCTOR_DATA_API} = profileEndpoints;


export async function getUserEnrolledCourses(token){
    const toastId = toast.loading("Loading...")
    let result = [];
    try{
        console.log("B Calling BACKEND API FOR ENROLLED COURSES");
        const response = await apiConnector("GET",GET_USER_ENROLLED_COURSES_API,null,{
            Authorization:`Bearer ${token}`,
        })
        console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response.data.data
    }
    catch(error){
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
        toast.error("Could Not Get Enrolled Courses")
    }
    toast.dismiss(toastId);
    return result;
}

export function getUserDetails(token,navigate){
    return async(dispatch)=>{
        const toastID = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("GET",GET_USER_DETAILS_API,null,
                {Authorization:`Bearer ${token}`},
            )
            console.log("GET_USER_DETAILS API RESPONSE............", response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            
            const userImagre = response?.data?.data?.image ?
            response.data.data.image :
            `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;
            dispatch(setUser(...response.data.data,userImagre))



        }
        catch(error){
            dispatch(logout(navigate));
            console.log("GET_USER_DETAILS API ERROR............", error)
            toast.error("Could Not Get User Details")}
            toast.dismiss(toastID);
            dispatch(setLoading(false));
    }
}

export async function changePassword(token,formData){
    const toastID = toast.loading("Loading...");
    try{
    const response = await apiConnector("POST",CHANGE_PASSWORD_API
        ,formData,
        {
            Authorization:`Bearer ${token}`
        })
        if (!response.data.success) {
            throw new Error(response.data.message)
          }
        toast.success("Password Changed Successfully")

    }
    catch(error){
        console.log("CHANGE_PASSWORD_API API ERROR............", error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastID);
}

export function deleteProfile(token,navigate){
    return async(dispatch)=>{
    const toastId = toast.loading("Loading...")
    try{
     const response = await apiConnector("DELETE",DELETE_PROFILE_API,null
        ,{
            Authorization:`Bearer ${token}`
        }
     )
     if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))

    }
    catch(error){
        console.log("DELETE_PROFILE_API API ERROR............", error)
        toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
    }
}

export async function getInstructoeData(token){
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
        const response = await apiConnector("GET",GET_INSTRUCTOR_DATA_API,
            null,
            {
                Authorization:`Bearer ${token}`
            }
        )
        console.log("Get Instructor api reaponse",response)
        result = response?.data?.courses;

    }
    catch(error){
        console.log("Get INSTUCTOR API ERROR",error)
        toast.error("could not get instrcutor data");

    }
    toast.dismiss(toastId)
    return result;

}





