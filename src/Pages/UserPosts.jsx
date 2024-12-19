import database from "@/Appwrite/database";
import conf from "@/conf/conf";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // ShadCN UI imports
import { MdMoreVert } from "react-icons/md";

const UserPosts = () => {
  const [blogs, setBlogs] = useState([]);

  const getAllPost = async () => {
    try {
      return await database.listDocuments(conf.databaseId, conf.collectionId, [
        Query.equal("status", "active"),
      ]);
    } catch (err) {
      console.log("Error :: getAllPost: ", err.message);
    }
  };

  useEffect(() => {
    getAllPost()
      .then((res) => setBlogs(res.documents))
      .then(console.log("render"));
  }, []);

  return (
    <div>
      {blogs.length == 0 ? (
        <div className="min-h-screen text-2xl flex justify-center items-center bg-gray-100 dark:bg-gray-900">
          <h1 className="text-center dark:text-white">No posts yet</h1>
        </div>
      ) : (
        <div className="mx-0 w-full px-4 py-10 bg-gray-100 dark:bg-gray-900 min-h-screen overflow-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Your Posts
          </h1>
          <div className="flex flex-wrap justify-center gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.$id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition hover:shadow-2xl dark:hover:shadow-gray-500 cursor-pointer"
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
                <div className="p-4 bg-gray-200 rounded-b-lg dark:bg-gray-700 relative z-0">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
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
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Edit
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Delete
                        </button>
                      </PopoverContent>
                    </Popover>
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
