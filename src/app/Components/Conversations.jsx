import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { getConversations } from "@/globalRedux/Slices/ConversationSlice";
import { ThreeDots } from 'react-loader-spinner';
import { logout } from "@/globalRedux/Slices/userSlice";
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export default function Conversations(){
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
    router.push(`/chat/${id}`)
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
           <>
      { 
        status === 'loading' ?(
        <ThreeDots
      
        color="#FFFFFF" // Change color of loader
        height={10} // Set height of loader
        width={100} // Set width of loader
      />
      )  :
    <>
       <div
          style={{
            backgroundColor: "#1C1C1C",
            boxShadow:
              "0 0 10px rgba(93, 91, 91, 0.8), 0 0 20px rgba(28, 28, 28, 0.5)"
          }}
          className="mt-6 p-4 rounded-lg border border-gray-600 "
        >
          <h2 className="text-lg font-semibold mb-2">Chats</h2>
          <div className="space-y-4">
            {conversations.length === 0 && <div className='text-center text-lg mt-6'>📭Your chat list is empty.<br/>🔍 Search for 'Pranjali' and send your first message!💬</div>}
            {conversations.map(conversation=>(
            <div key={conversation._id}>
           { conversation.lastMsg &&
            <div onClick={()=>openChat(conversation.members[0]._id)} className="p-2 bg-[#333] rounded-lg flex justify-between items-center" >
              <div>
                <h3 className="font-semibold">{conversation.members[0].name}</h3>
                <p className="text-sm">{conversation.lastMsg.text}</p>
              </div> 
              <span className="text-xs text-gray-400">{formatDate(conversation.lastMsg.createdAt)}</span>
            </div> } </div> ))}
           
            {/* Add more people as needed */}
          </div>
        </div>
        
    </>
    }
     
        </>
    )
}