'use client'
import { useState } from 'react';
import  {useSelector,useDispatch} from 'react-redux'
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from "next/navigation";
import { signup } from '@/globalRedux/Slices/userSlice';


export default function Signup(){
    const dispatch = useDispatch()
    const router = useRouter();
  
  
  
  const [pasState,setpasState] = useState('')
  
    const [credentials, setCredentials] = useState({
      username: '',
      password: '',
      confirmPassword : '',
      name : ''
    });
  
  const {user,error,status} = useSelector((state)=>state.user)

  const handleChange = (event) => {
      const { name, value } = event.target;
      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        [name]: value
      }));
    };

async function handleSubmit(event){
    event.preventDefault()
 setpasState('')

 if(credentials.password !== credentials.confirmPassword){
    setpasState('password and confirm password dont match')
    return;
 }

if(credentials.username == '' || credentials.name == '' || credentials.confirmPassword == '' || credentials.password == ''){return;}

    try {
        const result = await dispatch(signup({username : credentials.username,name : credentials.name, password : credentials.password , confirmPassword:credentials.confirmPassword}))
        if (result.meta.requestStatus === 'fulfilled') {
            router.push('/chat'); // Redirect to /chat if sign-in succeeds
          }
               
               } catch (error) {
               }
            }
function goToSignIn(){
    router.push('/')
}

    return(
        <><div className="h-screen flex  bg-[#f2e6f9]">
        <div className="h-screen flex w-full">
          <div className="w-full relative flex items-center justify-center  ">
            {/* SVG Background */}
            <svg 
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              style={{ height: "100%", width: "100%" }}
            >
              <defs >
                <linearGradient id="myGradient" gradientTransform="rotate(90)">
                  <stop offset="5%" stopColor="#EA226C" />
                  <stop offset="95%" stopColor="#4A4E69" />
                </linearGradient>
              </defs>
              <path
                d="M208.09,0.00 C152.70,67.10 262.02,75.98 200.80,150.00 L0.00,150.00 L0.00,0.00 Z"
                style={{ stroke: "none", fill: 'url("#myGradient")' }}
              />
            </svg>
       
            {/* Login Form */}
            <div className="absolute flex flex-col items-center space-y-4 p-8 bg-white shadow-lg rounded-lg opacity- z-4 bg-black lg:right-48"  >
              <h1 className="text-5xl text-indigo-600 font-bold mb-6">Chatly</h1>
              <input
                placeholder="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className="py-2 px-4 border rounded 2xl:w-80 xl:w-80 lg:w-80 md:w-80 sm:w-40 text-indigo-600 placeholder-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
                <input
               name="name"
               value={credentials.name}
               onChange={handleChange}
                placeholder="name"
                className="py-2 px-4 border rounded 2xl:w-80 xl:w-80 lg:w-80 md:w-80 sm:w-40 text-indigo-600 placeholder-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
               type="password"
               name="password"
               value={credentials.password}
               onChange={handleChange}
                placeholder="password"
                className="py-2 px-4 border rounded 2xl:w-80 xl:w-80 lg:w-80 md:w-80 sm:w-40 text-indigo-600 placeholder-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
                 <input
               type="password"
               name="confirmPassword"
               value={credentials.confirmPassword}
               onChange={handleChange}
                placeholder="confirm password"
                className="py-2 px-4 border rounded 2xl:w-80 xl:w-80 lg:w-80 md:w-80 sm:w-40 text-indigo-600 placeholder-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />{
                pasState && <div className="text-center text-black mt-2">{pasState}</div>
              }
              <button className="border-2 bg-purple-300 p-2 2xl:w-80 xl:w-80 lg:w-80 md:w-80 sm:w-40  text-purple-900 hover:bg-indigo-300 hover:text-indigo-900 rounded transition duration-500 ease-in-out font-bold uppercase" onClick={handleSubmit}>
                Signup
              </button>
              {status === 'loading' ?
            <div  className="flex justify-center">
            <ThreeDots
            
              color="#000000" // Change color of loader
              height={10} // Set height of loader
              width={100} // Set width of loader
            />
            
            </div> :
            status === 'failed' ?
            <div className='text-center'>
            <div className='text-red-500 font-semibold'>{error}</div>
            </div>
            :<></>
            }
      
            <div className="text-indigo-600  " onClick={goToSignIn}>
              <span className="underline underline-offset-1 cursor-default" >Signin</span>
            </div>
            </div>
          </div>
        </div>
      </div>
      </>
    )
}