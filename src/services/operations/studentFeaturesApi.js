import { apiConnector } from "../apiconnector";
import { studentEndpoints } from "../apis";
import {toast} from 'react-hot-toast'
import rzpLogo from "../../assets/Logo/Logo-Full-Dark.png"
import {setPaymentLoading} from "../../slices/courseSlice"
import { resetCart } from "../../slices/cartSlice";

const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

function  loadScript(src){
    return new Promise((resolve)=>{
        const scrip = document.createElement("script")
        scrip.src = src;
        scrip.onload = ()=>{
            resolve(true);
        }
        scrip.onerror = ()=>{
            resolve(false);
        }
        document.body.appendChild(scrip);
    })
}
export async function buyCourse(token,courses,userDetails,navigate,dispatch){
    // console.log('token', token)
    // console.log('courses', courses)
    // console.log('userDetails', userDetails)
    const toastId = toast.loading("Loading...");
    try{
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if(!res){
            toast.error("Razorpay script fail to load");
            return;
        }

        //initiate toe order
        const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API,{courses},
                           {
                            Authorization:`Bearer ${token}`
                           }
        )
        if(!orderResponse){
           throw new Error(orderResponse.data.message)
        }
        //  console.log("orderResponse...",orderResponse)
        // console.log("currency...",orderResponse.data.data.currency)
       //option
    const option ={
        key:process.env.RAZORPAY_KEY,
        currency:orderResponse.data.data.currency,
        amount:`${orderResponse.data.data.amount}`,
        order_id:orderResponse.data.data.id,
        name:"StudyNotion",
        description:"Thank You for Purchasing the Course",
        image:rzpLogo,
        prefill:{
            name:`${userDetails.firstName}`,
            email:userDetails.email,
        },
        handler: function(response){
            //send success full message
            sendPaymentSuccessEmail(response,orderResponse?.data?.data?.amount,token);
            //verify payment
            // console.log('{...response,courses}', {...response,courses})
            verifyPayment({...response,courses},token,navigate,dispatch);

        }
    }
    const paymentObject = new window.Razorpay(option);
    paymentObject.open();
    paymentObject.on("payment failed",function(response){
        toast.error("Payment Failed");
        // console.log('response.error', response.error)
    })
  


    }
    catch(error){
    // console.log('Payment Api Error....', error)
    toast.error("could not make payment")
    }
    toast.dismiss(toastId);

}

async function sendPaymentSuccessEmail(response,amount,token){
try{
    // console.log("Before email send success response")
    // console.log("razorpay response..",response)
const res= await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,
    {
        orderId:response.razorpay_order_id,
        paymentId:response.razorpay_payment_id,
        amount,
    },
    {
        Authorization:`Bearer ${token}`,
    })
    console.log(" after eamil send res---",res)
}
catch(error){
 console.log("Payment success email ERROR...",error)
}
}

async function verifyPayment(bodydata,token,navigate,dispatch){
   const toastId = toast.loading("Verifying Payment....");
//    console.log('bodyDddata', bodydata)
   dispatch(setPaymentLoading(true));
   try{
    
    const response = await apiConnector("POST",COURSE_VERIFY_API,
        bodydata,
        {
            Authorization:`Bearer ${token}`,
        }
    )
    // console.log("payment success response",response.data)
    if(!response.data.success){
        throw new Error(response.data.message);
    }
   
    toast.success("Payment Successful you are add to the course")
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());

   }
   catch(error){
    console.log("Payment Verify Error...",error);
    toast.error("Could not verfy payment");

   }
   toast.dismiss(toastId);
   dispatch(setPaymentLoading(false));

}