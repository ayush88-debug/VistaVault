import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JoditEditor from "jodit-react";
import { ID } from "appwrite";
import database from "@/Appwrite/database";
import conf from "@/conf/conf";
import storage from "@/Appwrite/bucket";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";


const BlogCreate = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("active");
  const [featuredImage, setFeaturedImage] = useState(null);
  const notify = () => toast("Blog Successfully Posted..!");


  const authData=useSelector((state)=> state.auth)
  const navigate=useNavigate()

  // Jodit
  const editor = useRef(null);
  let tempContent = useRef("");
  const config = {
    readonly: false,
    placeholder: "Type Something...!",
    height: 600,
  };

  const uploadImage=async()=>{
    try {
      return await storage.createFile(conf.bucketId, ID.unique(),featuredImage)
    } catch (err) {
      console.log("Error :: uploadImage: ", err)
    }
  }

  const uploadPost=async(imgLink)=>{
    try {
      return await database.createDocument(conf.databaseId, conf.collectionId,ID.unique(),{
        title:title,
        content:tempContent.current,
        imageLink: imgLink,
        userID: authData.userData.$id,
        status: status,
        author: authData.userData.name
      } )
    } catch (err) {
      console.log("Error :: uploadPost: ", err)
    }
  }
  const getImagePreview=async(imageID)=>{
    try {
      return await storage.getFilePreview(conf.bucketId, imageID)
    } catch (err) {
      console.log("Error :: getImagePreview: ", err.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "" || !tempContent.current) {
      alert("Enter Valid Title and Content")
    }
    else{
      uploadImage()
      .then(metaData=>getImagePreview(metaData.$id))
      .then(imgLink=> uploadPost(imgLink))
      .then(post => {
        if(post){
          navigate("/")
        }
      })
      .then(notify())
      .then(console.log("Blog posted Successfully"))
    }

  };

 

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
              accept="image/png, image/jpg, image/jpeg, image/gif"
              onChange={(e)=> setFeaturedImage(e.target.files[0])}
              required
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
              <option value="active" className="dark:text-white">
                Active
              </option>
              <option value="inactive" className="dark:text-white">
                Inactive
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

export default BlogCreate;
