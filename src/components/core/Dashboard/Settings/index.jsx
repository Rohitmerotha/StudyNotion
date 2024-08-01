import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture';
import EditProfile from './EditProfile';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';



export default function Setting(){
    return(
        <div className='flex flex-col text-white'>

    <div>Edit Profile</div>
    <ChangeProfilePicture/>
    <EditProfile/>
    <UpdatePassword/>
    <DeleteAccount/>
    </div>
    );
}