import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import account from '../Appwrite/services';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { addData } from '@/store/authSlice';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState();
  const navigate=useNavigate()

  const dispatch = useDispatch();

  const login=async()=>{
    try {
      return await account.createEmailPasswordSession(formData.email, formData.password)
    } catch (err) {
      console.log("error in login:",err.message)
      setError(err.message)
    }

  }

  const getUser = async () => {
    try {
      return await account.get();
    } catch (err) {
      console.log("Error in get account:", err);
    }
  };
 


  const handleSubmit=(e)=>{
    e.preventDefault()
    login().then(user => {
      if(user){
        getUser()
        .then(session=>{
          if(session){
            dispatch(
              addData({ username: session.name, userId: session.$id, isLoading: false })
            );
          }
        })
        .then(navigate("/"))
      }
    }
    )
  }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Login</h2>

        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e)=> setFormData({...formData, email: e.target.value})}
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
            onChange={(e)=> setFormData({...formData,password:e.target.value})}
            className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Not registered? <a href="/register" className="text-blue-500 hover:underline">Register</a></p>

        <Button
        type="submit"
          className="w-full py-3 mt-4  focus:outline-none"
          >Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;