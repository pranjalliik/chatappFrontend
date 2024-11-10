"use client"
import { useMediaQuery } from 'react-responsive';
import { Sidebar } from '../Components/Sidebar';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setReceiver } from '@/globalRedux/Slices/receiverSlice';
import Conversations from '../Components/Conversations';
import {setMsg} from '@/globalRedux/Slices/msgSlice';
import { ResConversations } from '../Components/ResConversations';
export default function chat({ children }){

    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 768px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const [query, setQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputBoxActive , setInputBoxActive] = useState(false)
    let {user} = useSelector((state)=>state.user)
    const dispatch = useDispatch()

    let router = useRouter()

    function debounce(func, delay) {
        let timeoutId;
        return (...args) => {
          if (timeoutId) {
            clearTimeout(timeoutId); // Clear the previous timeout
          }
          timeoutId = setTimeout(() => {
            func.apply(null, args); // Call the function after the delay
          }, delay);
        };
      }
  
    const fetchUsers = async (searchQuery) => {
      setLoading(true);
  
      // Fetch filtered users from the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user/v2/searchUsers?query=${searchQuery}`);
      const data = await response.json();
      if (response.ok) {
        setFilteredUsers(data.users);
      } else {
        console.error(data.error);
        setFilteredUsers([]);
      }
  
      setLoading(false);
    };
  
    // Create a debounced version of the fetchUsers function
    const debouncedFetchUsers = debounce(fetchUsers, 300);
  
    const handleSearch = (e) => {
      const value = e.target.value;
      setInputBoxActive(true)
      setQuery(value);
  
      if (value.length < 1) {
        setFilteredUsers([]);
        return;
      }
  
      // Call the debounced function instead of directly calling fetchUsers
      debouncedFetchUsers(value);
    };
  
    const handleClick = (user)=>{
      // dispatch(setMsg())

       router.push(`/chat/${user._id}`)
    }

    const handleClickRes = (user)=>{
      // dispatch(setMsg())

       router.push(`/msg/${user._id}`)
    }

    useEffect(() => {
      // Define the click handler
      const handleClick = (event) => {
        setInputBoxActive(false)
        // You can perform any action when a click occurs
      };
  
      // Add event listener for click events on the document
      document.addEventListener('click', handleClick);
  
      // Cleanup the event listener when the component unmounts
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, []);

    return(
        <>
 {isDesktopOrLaptop && ( <div className="flex h-screen  bg-black text-white">
  <Sidebar/>
  <div className="flex-1 flex">
  <div className="hidden md:block w-1/3 p-4 overflow-y-auto">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={handleSearch}
            className="w-full p-2 rounded-lg text-black"
          />
            
            <ul className="bg-zinc-800	 rounded-b-lg">
              {filteredUsers.map(user => (
                <div onClick={()=>handleClick(user)}  className="flex hover:bg-pink-700 hover:text-black" key={user._id}>
               <div
  className="w-10 h-10 rounded-full bg-cover bg-black m-2"
  style={{ backgroundImage: `url(${user.image})` }}
></div>

                <li className="p-2  mt-2 "  >
                  {user.username}
                </li>
              </div>
            ))}
            </ul>
            {filteredUsers.length === 0 && !loading && inputBoxActive &&<p>No users found</p>}
        </div>   
 <Conversations/> 
</div>
{children}

</div>
</div>  )}

 {isMobile && (
 <div className="bg-gray-100 h-screen md:hidden">
  {/* Top Section with Search Bar */}
  <div className="bg-pink-500 p-4 relative">
    {/* Floating button */}
    { user&&   
          <div  className="rounded-full w-10 h-10 font-bold text-xl text-center  pt-1	 bg-gray-400">{user.name.charAt(0)}</div>
          }
              {/* Search Bar */}
    <div className="mt-4">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleSearch}
        className="w-full text-black p-3 rounded-lg bg-white border-none shadow-sm"
      />
              <ul className="bg-zinc-800	 rounded-b-lg">
              {filteredUsers.map(user => (
                <div onClick={()=>handleClickRes(user)}  className="flex hover:bg-pink-700 hover:text-black" key={user._id}>
               <div
  className="w-10 h-10 rounded-full bg-cover bg-black m-2"
  style={{ backgroundImage: `url(${user.image})` }}
></div>

                <li className="p-2  mt-2 "  >
                  {user.username}
                </li>
              </div>
            ))}
            </ul>
            {filteredUsers.length === 0 && !loading && inputBoxActive &&<p>No users found</p>}
    </div>
  </div>
  {/* Chat List */}
 <ResConversations/>
</div>)}
</> )
}
