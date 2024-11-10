'use client'
import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { getConversations } from "@/globalRedux/Slices/ConversationSlice";
import { ThreeDots } from 'react-loader-spinner';
import { logout } from "@/globalRedux/Slices/userSlice";
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function ResConversations(){

    const dispatch = useDispatch()
    const router = useRouter();

    useEffect(()=>{
        dispatch(getConversations())
    },[])
    const {conversations, status,error} = useSelector((state)=>state.conv)
    useEffect(() => {
        if (status === 'failed' && error === 'Request failed with status code 401') {
            dispatch(logout());
            router.push('/');
        }
      }, [status, error]);


   function openChat(id){
    router.push(`/msg/${id}`)
   }

   const formatDate = (createdAt) => {
    const date = parseISO(createdAt); // Parse the ISO date string to a Date object
  
    const isTodayDate = isToday(date);
    const isYesterdayDate = isYesterday(date);
  
    if (isTodayDate) {
      return `Today ${format(date, 'h:mm a')}`; // Example: "Today at 3:00 AM"
    } else if (isYesterdayDate) {
      return `Yesterday  ${format(date, 'h:mm a')}`; // Example: "Yesterday at 5:00 PM"
    } else {
      return format(date, 'd MMM'); // Example: "5 Nov"
    }
  };

    return(
        <div className="p-4">
        {/* Chat item */}
        {conversations.map(conversation=>(
        <div onClick={()=>openChat(conversation.members[0]._id)} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4" key={conversation._id}>
          <div className="flex items-center space-x-4">
            {/* Profile picture 
            <img
              src="https://via.placeholder.com/50"
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />*/}
            {/* Chat text */}
            <div>
              <h4 className="font-bold text-black">{conversation.members[0].name}</h4>
              <p className="text-sm text-gray-500">{conversation.lastMsg.text}</p>
            </div>
          </div>
          {/* Time and heart icon */}
          <div className="text-right">
            <p className="text-sm text-gray-400">{formatDate(conversation.lastMsg.createdAt)}</p>
            <i className="text-red-500">❤️</i>
          </div>
        </div> ))}
        {/* Repeat similar blocks for each chat item */}
        {/* You can also use loops if this is dynamically rendered content */}
      </div>
    )
}