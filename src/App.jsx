import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import RegistrationForm from './Pages/Register'
import LoginForm from './Pages/Login'
import Home from './Pages/Home'
import CreatePost from './Pages/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {  fetchAuth } from './store/authSlice'
import AllPosts from './Pages/AllPosts'
import 'ldrs/quantum'
import UserPosts from './Pages/UserPosts'
import BlogPost from './Pages/Post'
import Header from './Pages/Header'
import Footer from './Pages/Footer'
import { fetchBlogs } from './store/blogsSlice'
import { fetchUserBlogs } from './store/userBlogSlice'
import UpdateBlog from './Pages/UpdatePost'



function ProtectedRoute({user, children}) {
  return user ? children : <Navigate to={'/login'}/>
}
function PublicRoute({user, children}) {
  return !user ? children : <Navigate to={'/'}/>
}


function App() { 
  console.log("App Renderd")
  const dispatch = useDispatch();
  const authData=useSelector((state)=> state.auth)

  useEffect(()=>{
    dispatch(fetchAuth())
    dispatch(fetchBlogs())
  },[])

  useEffect(()=>{
    if(authData.userData){
      dispatch(fetchUserBlogs(authData.userData.$id))
    }
  },[authData.userData])



  const router=createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/' element={<Home/>}>
          <Route path='' element={<AllPosts/>} />
          <Route path='your-posts' element={<ProtectedRoute user= {authData.userData}> <UserPosts/> </ProtectedRoute>}/>
        </Route>
        <Route path='/register' element={<PublicRoute user= {authData.userData}> <RegistrationForm/> </PublicRoute>}/>
        <Route path='/login' element={<PublicRoute user= {authData.userData}> <LoginForm/> </PublicRoute>}/>
        <Route path='/create' element={<ProtectedRoute user= {authData.userData}> <CreatePost/> </ProtectedRoute>} />
        <Route path='/post/:postID' element={
          <>
          <Header/>
          <BlogPost/>
          <Footer/>
          </>
          } />

          <Route path='update/:postID' element={<ProtectedRoute user= {authData.userData} > <UpdateBlog/> </ProtectedRoute>}/>
        
      </Route>
    )
  )

  if(authData.isLoading){
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
