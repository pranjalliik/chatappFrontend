'use client';
import { useDispatch , useSelector} from "react-redux";
import { signout } from "@/globalRedux/Slices/userSlice";
import { useRouter } from 'next/navigation';

function Sidebar(){
const dispatch = useDispatch()
const router = useRouter()
let {user} = useSelector((state)=>state.user)
async function logout(){
  const actionResult = await dispatch(signout());

  if (signout.fulfilled.match(actionResult)) {
    router.push('/');
  }}

    return(
        <div className="hidden md:flex flex-col rounded-lg bg-pink-600 p-4 w-16 m-3 md:w-16 lg:w-20 relative">
        <div className="mb-4">
       { user&&   
          <div  className="rounded-full w-10 h-10 font-bold text-xl text-center  pt-2	 bg-black">{user.name.charAt(0)}</div>
          }
        </div>
        <div className="space-y-8 bottom-12 absolute">
         { /*<i className="fas fa-home text-white text-2xl" />
          <i className="fas fa-users text-white text-2xl" />
          <i className="fas fa-bell text-white text-2xl" /> */}
          <div className="ml-1 cursor-default hover:bg-black rounded-lg " onClick={logout}>
          <span className="material-symbols-outlined"  style={{ fontSize: '35px' }}>
           logout
           </span>
           </div>
        </div>
      </div>
    )
}

export {Sidebar}