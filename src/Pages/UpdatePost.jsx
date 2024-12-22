import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JoditEditor from "jodit-react";
import { ID } from "appwrite";
import database from "@/Appwrite/database";
import conf from "@/conf/conf";
import storage from "@/Appwrite/bucket";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { fetchBlogs } from "@/store/blogsSlice";
import { fetchUserBlogs } from "@/store/userBlogSlice";


const UpdateBlog = () => {
  console.log("post render")
  const {postID}=useParams()
  const [post, setPost]=useState(null)

  const getPost=async()=>{
    try {
        return await database.getDocument(
            conf.databaseId,
            conf.collectionId,
            postID
        )
    } catch (err) {
        console.log("Error in getPost:: ", err.message)
        setError(err.message)
    }
   }

   useEffect(() => {
    if (postID) {
        setLoading(true)
        getPost()
        .then(data=>{
            if(data){
                setPost(data)
                setTitle(data.title)
                tempContent.current=data.content
                setStatus(data.status)
                setLoading(false)
            }
        })
    }
   }, [postID]);

   

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("private");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [error, setError]=useState(null)
  const [loading , setLoading]=useState(false)


  const authData=useSelector((state)=> state.auth)
  const dispatch=useDispatch()
  const navigate=useNavigate()

  // Jodit
  const editor = useRef(null);
  let tempContent = useRef("");
  const config = {
    readonly: false,
    placeholder: "Type Something...!",
    height: 600,  
  };

  const deleteImage=async()=>{
    try {
      return await storage.deleteFile(conf.bucketId, post.fileID )
    } catch (err) {
      console.log("Error :: deleteImage: ", err)
      setError(err.message)
      setLoading(false)
    }
  }

  const uploadImage=async()=>{
    try {
      return await storage.createFile(conf.bucketId, ID.unique(), featuredImage)
    } catch (err) {
      console.log("Error :: uploadImage: ", err)
      setError(err.message)
      setLoading(false)
    }
  }

  const updatePost=async(imgLink,fileID)=>{
    try {
      return await database.updateDocument(conf.databaseId, conf.collectionId,post.$id,{
        title:title,
        content:tempContent.current,
        imageLink: imgLink,
        fileID:fileID,
        userID: authData.userData.$id,
        status: status,
        author: authData.userData.name
      } )
    } catch (err) {
      console.log("Error :: updatePost: ", err)
      setError(err.message)
      setLoading(false)
    }
  }
  const getImagePreview=async(imageID)=>{
    try {
      return await storage.getFilePreview(conf.bucketId, imageID)
    } catch (err) {
      console.log("Error :: getImagePreview: ", err.message)
      setError(err.message)
      setLoading(false)
    }
  }

  const syncAllMethhod=async()=>{
    try {
      setLoading(true)
      await deleteImage()
      const metaData=await uploadImage()
      const imageLink=await getImagePreview(metaData.$id)
      const post=await updatePost(imageLink,metaData.$id)
      console.log("Blog posted Successfully")
      if(post){
        dispatch(fetchBlogs())
        dispatch(fetchUserBlogs(authData.userData.$id))
        await navigate("/your-posts")
        setLoading(false)
      }
    } catch (err) {
      console.log("Error :: syncAllMethhod: ", err.message)
      setError(err.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "" || !tempContent.current) {
      toast("Enter Valid Title and Content")
    }
    else{
      if(post){
        
        syncAllMethhod()
      }
    }

  };

  if(error){
    toast(error)
  }

  if (loading) {
    return (
      <div className='h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900'>
      <l-quantum
      size="45"
      speed="1.75"
      color="black">      </l-quantum>
     </div>
    );
   }

 

  return (
    <div className=" mx-0 px-4 py-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Create New Blog
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row justify-between space-x-0 lg:space-x-10"
      >
       
        <div className="w-full lg:w-3/5 space-y-6">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="text-gray-700 dark:text-gray-300 mb-2 block"
            >
              Blog Title
            </label>
            
            <Input
              type="text"
              id="title"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-orange-500 focus:ring-1"
            />
          </div>

          {/* Jodit Editor */}
          <div>
            <label
              htmlFor="content"
              className="text-gray-700 dark:text-gray-300 mb-2 block"
            >
              Blog Content
            </label>
            
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <JoditEditor
                ref={editor}
                required={true}
                value={tempContent.current}
                config={config}
                onChange={(newContent) => (tempContent.current = newContent)}
              />
            </div>
          </div>
        </div>

        
        <div className="w-full lg:w-2/5 space-y-6 mt-6 lg:mt-0">
          
          <div>
            <label
              className="text-gray-700 dark:text-gray-300 mb-2 block"
              htmlFor="featuredImage"
            >
              Featured Image
            </label>
            <input
              id="featuredImage"
              type="file"
              required
              accept="image/png, image/jpg, image/jpeg, image/gif"
              onChange={(e)=> setFeaturedImage(e.target.files[0])}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            />
            {featuredImage && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(featuredImage)}
                  alt="Featured"
                  className="w-80 h-44 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>
            )}
          </div>

          {/* Status Select */}
          <div>
            <label
              htmlFor="status"
              className="text-gray-700 dark:text-gray-300 mb-2 block"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="px-4 py-2 border rounded-lg w-full bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700  focus:ring-1"
            >
              <option value="public" className="dark:text-white">
                Public
              </option>
              <option value="private" className="dark:text-white">
                Private
              </option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8">
            <Button
              type="submit"
              className="px-6 py-3 rounded-lg"
            >
              Create Blog
            </Button>
          </div>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
