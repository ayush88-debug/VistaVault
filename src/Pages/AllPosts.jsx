
import database from "@/Appwrite/database";
import conf from "@/conf/conf";
import { Query } from "appwrite";
import { useEffect, useState } from "react";

const AllPosts = () => {

    const [blogs,setBlogs]=useState([])

    const getAllPost=async()=>{
        try {
            return await database.listDocuments(conf.databaseId,conf.collectionId, [Query.equal('status','active')] )
        } catch (err) {
            console.log("Error :: getAllPost: ", err.message)
        }
    }

    useEffect(()=>{
      getAllPost()
      .then(res=> setBlogs(res.documents))
      .then(console.log("render"))
    },[])





    return (
      <div>
        {blogs.length == 0 ? (
          <div className="min-h-screen text-2xl flex justify-center items-center bg-gray-100 dark:dark:bg-gray-900">
            <h1 className="text-center dark:text-white">No posts yet</h1>
          </div>
        ) : (
          <div className="mx-0 w-full px-4 py-10 bg-gray-100 dark:bg-gray-900 min-h-screen overflow-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
              All Blogs
            </h1>
            <div className="flex flex-wrap justify-center gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog.$id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition hover:shadow-2xl cursor-pointer"
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
                  <div className=" p-4 bg-gray-200 rounded-b-lg dark:bg-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
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
