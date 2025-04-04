
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; 
import { MdMoreVert } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { MdLock } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import database from "@/Appwrite/database";
import conf from "@/conf/conf";
import storage from "@/Appwrite/bucket";
import { fetchBlogs } from "@/store/blogsSlice";
import { fetchUserBlogs } from "@/store/userBlogSlice";
import { useEffect, useState } from "react";


const UserPosts = () => {

  const userBlogsData=useSelector((state)=>state.userBlogs)
  const navigate=useNavigate()
  const authData=useSelector((state)=> state.auth)
  const dispatch=useDispatch()


  //loading
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



    if(userBlogsData.userblogsLoading){
      return(
        <div className='h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900'>
          <l-quantum
          size="45"
          speed="1.75"
          color={loaderColor}>      </l-quantum>
        </div>
      )
    }

    if(userBlogsData.userblogsError){
      return(
        <div className='h-screen flex justify-center items-center'>
          <h2>Something went wrong..!</h2>
        </div>
      )
    }

    const deletePost=async(post)=>{
      try {
        await database.deleteDocument(conf.databaseId, conf.collectionId, post.$id)
        await storage.deleteFile(conf.bucketId, post.fileID )
        dispatch(fetchBlogs())
        dispatch(fetchUserBlogs({userID:authData.userData.$id}))
      } catch (err) {
        console.log("Error :: deletePost: ", err.message)
        toast(err.message)
      }
    }

  return (
    <div>
      { userBlogsData.userBlogs.length == 0 ? (
        <div className="min-h-screen text-2xl flex justify-center items-center bg-gray-100 dark:bg-gray-900">
          <h1 className="text-center dark:text-white">You have not posted any blogs yet. Start sharing your thoughts today!</h1>
        </div>
      ) : (
        <div className="mx-0 w-full px-4 py-10 bg-gray-100 dark:bg-gray-900 min-h-screen overflow-auto">

          <div className="flex flex-wrap justify-center gap-6">
            {userBlogsData.userBlogs
            .map((blog) => (
              <div
                key={blog.$id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition hover:shadow-2xl dark:hover:shadow-gray-500 cursor-pointer"
              >
                {/* Blog Image */}
                <div className="w-full h-44 bg-gray-200 dark:bg-gray-700"
                onClick={() => navigate(`/post/${blog.$id}`)}
                >
                  <img
                    src={blog.imageLink}
                    alt={blog.title}
                    className="w-80 h-full object-cover object-center rounded-lg border border-gray-300 dark:border-zinc-300"
                  />
                </div>
                {/* Blog Details */}
                <div className="p-4 bg-gray-200 rounded-b-lg dark:bg-gray-700 relative z-0 w-80">
                  {blog.status=="private" && (
                    <div className="absolute top-2 right-2">
                    <span className="text-red-500">
                      <MdLock className="w-6 h-6" />
                    </span>
                    </div>
                  )}
                  <h2 
                  onClick={() => navigate(`/post/${blog.$id}`)}
                  className="text-lg font-semibold text-gray-800 dark:text-white mb-2 w-4/5 overflow-hidden whitespace-nowrap text-ellipsis">
                    {blog.title}
                  </h2>
                  <p 
                  onClick={() => navigate(`/post/${blog.$id}`)}
                  className="text-sm text-gray-600 dark:text-gray-300 w-4/5 overflow-hidden whitespace-nowrap text-ellipsis">
                    By {blog.author}
                  </p>
                  {/* Popover Menu */}
                  <div className="absolute bottom-2 right-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          aria-label="Options"
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <MdMoreVert className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-white w-fit dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-2">
                        <button
                        onClick={() => navigate(`/update/${blog.$id}`)}
                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Edit
                        </button>
                        <button
                        onClick={()=>{deletePost(blog)}}
                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Delete
                        </button>
                      </PopoverContent>
                    </Popover>
                    <ToastContainer />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
