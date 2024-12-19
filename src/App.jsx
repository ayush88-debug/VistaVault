
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider, useNavigate } from 'react-router-dom'
import './App.css'
import RegistrationForm from './Pages/Register'
import LoginForm from './Pages/Login'
import Home from './Pages/Home'
import CreatePost from './Pages/CreatePost'
import account from './Appwrite/services'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { addData, toggleLoading } from './store/authSlice'
import AllPosts from './Pages/AllPosts'
import 'ldrs/quantum'



function ProtectedRoute({user, children}) {
  return user ? children : <Navigate to={'/login'}/>
}
function PublicRoute({user, children}) {
  return !user ? children : <Navigate to={'/'}/>
}


function App() { 
  console.log("App Renderd")
  const dispatch = useDispatch();
  const userData=useSelector((state)=> state.auth.data)

  const getUser = async () => {
    try {
      return await account.get();
    } catch (err) {
      console.log("Error in get account:", err);
    }
  };

  useEffect(() => {
    getUser().then((user) => {
      if(user){
        dispatch(
          addData({ username: user.name, userId: user.$id, isLoading: false })
        );
        console.log(user);
      }else{
        dispatch(toggleLoading(false))
      }
    });
  }, []);



  const router=createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/' element={<ProtectedRoute user= {userData.userId}> <Home/> </ProtectedRoute>}>
          <Route path='' element={<AllPosts/>} />
        </Route>
        <Route path='/register' element={<PublicRoute user= {userData.userId}> <RegistrationForm/> </PublicRoute>}/>
        <Route path='/login' element={<PublicRoute user= {userData.userId}> <LoginForm/> </PublicRoute>}/>
        <Route path='/create' element={<ProtectedRoute user= {userData.userId}> <CreatePost/> </ProtectedRoute>} />
      </Route>
    )
  )

  if(userData.isLoading){
    return(
      <div className='h-screen flex justify-center items-center'>
        <l-quantum
        size="45"
        speed="1.75"
        color="black">      </l-quantum>

      </div>
    )
  }

  return (
    <>
     <RouterProvider router={router}/>
    </>
  )
}

export default App
