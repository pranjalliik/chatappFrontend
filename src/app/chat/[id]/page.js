'use client'
import { useMediaQuery } from 'react-responsive';
import {useState,useEffect , useRef} from 'react'
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getConversationMessages } from '@/globalRedux/Slices/msgSlice';
import { useDispatch,useSelector} from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';
import { logout } from '@/globalRedux/Slices/userSlice';
import io from "socket.io-client";
import { updateChatMsgs ,updateConversation,msgStatusUpdate} from '@/globalRedux/Slices/msgSlice';
import uniqid from 'uniqid';
import axios from 'axios';
import { format, isSameDay, parseISO } from 'date-fns';
import { addConversation,updateOnMsgSend } from '@/globalRedux/Slices/ConversationSlice';
import { incrementIdx} from '@/globalRedux/Slices/idxSlice'

export default function conv(){
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 768px)' });
     const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
     const router = useRouter();
     const params = useParams()
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [userErr, setError] = useState(null);
    const containerRef = useRef(null);

    if(isMobile){
 router.push(`msg/${params.id}`)
}

useEffect(()=>{
dispatch(getConversationMessages({id:params.id}))
const fetchData = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/user/v2/${params.id}`);
    setData(response.data.user[0]); // Set the data in state
  } catch (err) {
    setError(err); // Handle errors
  }
};

fetchData(); // Call the async function
},[params.id])


  
// Define your backend URLs
const backends = [`${process.env.NEXT_PUBLIC_API_BACK_URL}`, `${process.env.NEXT_PUBLIC_API_BACK_URL_TWO}`];



 let {status , messages,conversation,error} = useSelector((state)=>state.msg)
 let {receiverInfo} = useSelector((state)=>state.receiver)
 let {user} =  useSelector((state)=>state.user)
 const [newMsg,setNewMsg] = useState("");
 const [socket, setSocket] = useState(null);

 const handleChange = (event) => {
  const {value } = event.target;
 setNewMsg(value)
};
useEffect(() => {
  if (status === 'failed' && error === 'Request failed with status code 401') {
      dispatch(logout());
      router.push('/');
  }
}, [status, error]);



// Group messages based on valid date only
const groupedMessages = messages.reduce((acc, message) => {


  const isValidDate =  message.createdAt && message.createdAt !== "loading" && message.createdAt !== "failed";

  // If valid, format the date; otherwise, use a placeholder grouping key
  const messageDate = isValidDate
    ? format(parseISO(message.createdAt), 'yyyy-MM-dd') // Use formatted date
    : "pending"; // Placeholder key for messages in "loading" or "failed" state

  // Initialize array for each date
  if (!acc[messageDate]) acc[messageDate] = [];
  acc[messageDate].push(message);

  return acc;
}, {});



async function sendMsg(event){
  if (event.key != 'Enter') return

  if(newMsg === '')return;



  let response = ''
if(!conversation){
  try{
    response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BACK_URL}api/chat/v1`,
    JSON.stringify({ receiver : params.id }),
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true // Correct setting for axios
    }
);
dispatch(updateConversation(response.data.conversation));
dispatch(addConversation(response.data.conversation))

  }catch(err){

  }
}

let con = ''
if(!response){
  con = conversation._id
}else{
  con = response.data.conversation._id
}

let msgId = uniqid()
dispatch(updateChatMsgs({text :newMsg,sender:user._id,_id: msgId, createdAt:'loading'}))
const msgToBeSent = {
  text: newMsg,
  sender: user,
  receiver: params.id ,
  conversation   :  con    
};

try {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BACK_URL}api/msg/v2`,
    JSON.stringify({ text : newMsg, conversation : con }),
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true // Correct setting for axios
    }
);

if(response.status == 200){
    dispatch(msgStatusUpdate({status : response.data.msg.createdAt , id : msgId}))
    dispatch(updateOnMsgSend({conversationId :con, newMessage:response.data.msg}))
  }
//  return response.data;
} catch (error) {

  dispatch(msgStatusUpdate('failed'))
}



if(socket) {
  socket.emit('chat msg', msgToBeSent);
} 
setNewMsg("")
}

useEffect(() => {

    const newSocket = io(`${backends[Math.round(Math.random())]}`, {
         query: {
            user: user._id
         }   
    })
    setSocket(newSocket);
  
    newSocket.on('chat msg', msg => {
        if(msg.sender._id === params.id){
          dispatch(updateChatMsgs({text : msg.text ,sender: msg.sender._id,_id: uniqid() , createdAt : new Date().toISOString()}))
        }
      });
  
    
    return () => newSocket.close();
  },[user]);
  
  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]); 
  
  

  return(<>
<div className="flex-1 flex flex-col bg-[#1c1c1c] p-4 overflow-y-auto">
  <div className="flex justify-between items-center mb-4 pb-2 border-slate-500	 border-b">
  { data && <div className="flex items-center space-x-4">
    <span  className="rounded-full w-10 h-10 font-bold text-xl text-center  pt-2	 bg-black">{data.name.charAt(0)}</span>
      <div>
        
        <h2 className="font-semibold">{data.name}</h2> 
      { /* <p className="text-sm text-gray-400">Online - Last seen 2:02pm</p> */}
      </div>
    </div> }
    <div className="flex space-x-4 text-gray-400">
     {/* <i className="fas fa-phone" />
      <i className="fas fa-video" />
      <i className="fas fa-ellipsis-h" /> */}
    </div>
  </div>
  {/* Chat Messages */}
 
 {
  status === 'loading'?(<>
        <ThreeDots
      
      color="#FFFFFF" // Change color of loader
      height={10} // Set height of loader
      width={100} // Set width of loader
    />
  </>

  )
:
<div ref={containerRef} className="flex-1 overflow-y-auto">
  <div className="space-y-4">
    {Object.keys(groupedMessages).map((date) => (
      <div key={date}>
        {date !== "pending" && (
          <div className="text-center text-gray-500 my-2">
            {format(parseISO(date), 'MMMM d, yyyy')}
          </div>
        )}

        {groupedMessages[date].map((message) => (
          <div
            className={`flex ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
            key={message._id}
          >
            <div className={`${message.sender === user._id ? 'bg-pink-600' : 'bg-[#333]'} px-3 pt-2 mb-3 rounded-xl text-white`}>
              {message.text}
              <div className="text-xs text-gray-400 mt-1 mb-1">
                {/* Display time, "Loading...", or "Failed" */}
                {message.createdAt === "loading"
                  ? "Loading..."
                  : message.createdAt === "failed"
                  ? "Failed"
                  : format(parseISO(message.createdAt), 'h:mm a')}
              </div>
           </div>
         
          </div>
        ))}
      </div>
    ))}
  </div>
</div>


}

  {/* Input Area */}
  <div className="mt-4">
    <div className="flex items-center ">
      <input
         onKeyDown={sendMsg}
        type="text"
        placeholder="Type your message here..."
        className="flex-1 p-3 rounded-full bg-[#333] text-white"
        value={newMsg} onChange={handleChange}
      />
      <div className="p-2 hover:text-pink-500" onClick={()=>sendMsg({key : 'Enter'})}>
      <i className="fas fa-paper-plane"></i>

      </div>
    </div>
  </div>
</div>  </>)
}



