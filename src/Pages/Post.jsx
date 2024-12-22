import "../style.css"
import database from "@/Appwrite/database";
import conf from "@/conf/conf";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import parse from 'html-react-parser';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaShareAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

const BlogPost = () => {

    const {postID}=useParams()
    const [post, setPost]=useState(null)
    const [error, setError] = useState(false);
    const navigate=useNavigate()

    //share feature
    const [linkCopied, setLinkCopied] = useState(false);
    const shareableLink = window.location.href;
    const authData=useSelector((state)=> state.auth)


    const getPost=async()=>{
        try {
            return await database.getDocument(
                conf.databaseId,
                conf.collectionId,
                postID
            )
        } catch (err) {
            console.log("Error in getPost:: ", err.message)
            setError(true);
        }
    }

    useEffect(() => {
        if (postID) {
            getPost()
            .then(data=>{
                if(data){
                    setPost(data)
                }
            })
        }
    }, [postID]);


    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
                <h1 className="text-center text-xl text-red-500">Something went wrong. Please try again later.</h1>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
                <h1 className="text-center text-lg text-gray-700 dark:text-gray-300">Loading blog post...</h1>
            </div>
        );
    }

    if(!authData.userData && post.status=="private" ){
      navigate("/")
    }

    //share feature

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareableLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000); 
    };

      


    return (

        <div className="bg-white dark:bg-gray-800 w-full min-h-screen pb-6  pt-6">
        <div 
        className="bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition cursor-pointer mx-auto max-w-3xl">
          {/* Blog Image */}
          <div className="w-full h-auto bg-gray-100 dark:bg-gray-900">
            <img
              src={post.imageLink}
              alt={post.title}
              className="w-full max-h-96 object-cover object-center"
            />
          </div>
    
          {/* Blog Details */}
          <div className="p-8 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-2xl font-bold text-center text-black dark:text-white mb-6 break-words">
              {post.title}
            </h1>
            <div className="text-justify text-gray-950 dark:text-gray-200 leading-relaxed mb-8 text-pretty">
              {parse(post.content)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center">
              <p>
                By: <span className="font-medium text-gray-800 dark:text-white overflow-hidden whitespace-break-spaceswrap text-ellipsis">{post.author}</span>
              </p>
              <p>{new Date(post.$updatedAt).toLocaleDateString()}</p>
              {/* Share Button */}
              {post.status=="public" && (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-4" variant="outline">
                    <FaShareAlt className="mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
                  <div className="flex items-center">
                    <Input
                      className="flex-1"
                      value={shareableLink}
                      readOnly
                    />
                    <Button
                      variant="outline"
                      className="ml-2"
                      onClick={handleCopyLink}
                    >
                      {linkCopied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        </div>

    );


};

export default BlogPost;
