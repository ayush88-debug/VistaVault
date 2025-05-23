
import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";




const AllPosts = () => {


  const blogsData=useSelector((state)=> state.blogs) 
  const navigate=useNavigate()

  const themeMode=useSelector(state=> state.theme.themeMode)

  const [loaderColor,setLoaderColor]=useState("")

  useEffect(()=>{
    if(themeMode=="dark"){
      setLoaderColor("white")
    }
    else{
      setLoaderColor("black")
    }
  },[])



  if(blogsData.blogloading){
    return(
      <div className='h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900'>
        <l-quantum
        size="45"
        speed="1.75"
        color={loaderColor}>      </l-quantum>
      </div>
    )
  }

  if(blogsData.blogError){
    return(
      <div className='h-screen flex justify-center items-center'>
        <h2>Something went wrong..!</h2>
      </div>
    )
  }

  return (
    <div>
      {blogsData.allBlogs.length == 0 ? (
        <div className="min-h-screen text-2xl flex justify-center items-center bg-gray-100 dark:dark:bg-gray-900">
          <h1 className="text-center dark:text-white">No posts yet</h1>
        </div>
      ) : (
        <div className="mx-0 w-full px-4 py-10 bg-gray-100 dark:bg-gray-900 min-h-screen overflow-auto">

          <div className="flex flex-wrap justify-center gap-6">
            {blogsData.allBlogs.map((blog) => (
              <div
                key={blog.$id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition hover:shadow-2xl dark:hover:shadow-gray-500 cursor-pointer"
                onClick={() => navigate(`/post/${blog.$id}`)}
              >
                {/* Blog Image */}

                <div className="w-full h-44 bg-gray-200 dark:bg-gray-700"> 
                  <img
                    src={blog.imageLink}
                    alt={blog.title}
                    className="w-80 h-full object-cover object-center rounded-lg border border-gray-300 dark:border-zinc-300"
                  />
                </div>
                {/* Blog Details */}
                <div className=" w-80 p-4 bg-gray-200 rounded-b-lg dark:bg-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 w-4/5 overflow-hidden whitespace-nowrap text-ellipsis">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 w-4/5 overflow-hidden  whitespace-nowrap text-ellipsis">
                    By {blog.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPosts;
