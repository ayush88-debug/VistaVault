import  { useState } from 'react';
import account from '../Appwrite/services';
import { ID } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast, ToastContainer } from 'react-toastify';


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState("");

  const navigate=useNavigate()

  const register=async ()=>{
    try {
        return await account.create(ID.unique(), formData.email,formData.password, formData.name)
    } catch (err) {
        console.log(err.message)
        setError(err.message)
    }
  }

  const handleSubmit=async (e)=>{
    e.preventDefault()
    const user=await register()
    if(user){
        toast("Registerd Successfully")
        navigate("/login")    
    }
    
  }

  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Register</h2>

        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e)=>{setFormData({...formData, name: e.target.value})}}
            required
            className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
         
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e)=>{setFormData({...formData, email: e.target.value})}}
            className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
   
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e)=>{setFormData({...formData, password: e.target.value})}}
            className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">Already registered? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>

        <Button
        type="submit"
          className="w-full py-3 mt-4  focus:outline-none"
          >Register</Button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default RegistrationForm;
