import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { BASE_URL } from '../constants/constants';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(BASE_URL + '/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: 'patient', // Default role for signup
          }),
        });
        if (response.ok) {
          navigate('/login');
        } else {
          const errorData = await response.json();
          console.log('Error data:', errorData); // Add this line to log the error data
          setErrors({ ...errors, submit: errorData.error });
          return toast.error("An error occurred. Please try again.");
        }
      } catch (error) {
        setErrors({ ...errors, submit: 'An error occurred. Please try again.' });
        return toast.error("An error occurred. Please try again.");
      }
    }
  };

  const [currentImage, setCurrentImage] = useState(0);
    const images = [
      'AppointmentPhoto.png',
      'DoctorsPhoto.png',
      'NursePhoto.png',
      'HeartPulsePhoto.png'
    ];
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 2000);
  
      return () => clearInterval(interval); // Cleanup
    }, []);

  return (
    <div className='min-h-screen flex flex-row'>
      {/* Left Side - Image Slider */}
      <div className="w-1/2 bg-white flex justify-center items-center relative h-screen overflow-hidden">
        <div className="flex flex-col justify-center items-center gap-5">
          
          {/* Image Slider Container */}
          <div className="relative h-[50vh] w-[50vh]">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Slider"
                className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
                  currentImage === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          {/* Tagline */}
          <h1 className="text-blue-600 text-3xl font-semibold text-center">Smart Access to Healthcare</h1>
        </div>
      </div>
      <div className="w-1/2 bg-blue-600 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-2xl font-bold text-center">Sign Up as a Patient</h2>
              <p className="text-center text-blue-100">Create your account to access health services</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-blue-800 text-left">First Name</label>
                      <input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        className="mt-1 block w-full rounded-md border border-blue-200 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 pl-1" 
                        required
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-blue-800 text-left">Last Name</label>
                      <input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        className="mt-1 block w-full rounded-md border border-blue-200 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 pl-1" 
                        required
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-800 text-left">Email</label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="mt-1 block w-full rounded-md border border-blue-200 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 pl-1" 
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-blue-800 text-left">Password</label>
                    <div className="flex items-center">
                      <input 
                        id="password" 
                        name="password" 
                        type={showPassword ? 'text' : 'password'} 
                        value={formData.password} 
                        onChange={handleChange} 
                        className="mt-1 block w-full rounded-md border border-blue-200 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 pl-1" 
                        required
                      />
                      <button 
                        type="button" 
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:shadow-outline"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-800 text-left">Confirm Password</label>
                    <div className="flex items-center">
                      <input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        className="mt-1 block w-full rounded-md border border-blue-200 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 pl-1" 
                        required
                      />
                      <button 
                        type="button" 
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:shadow-outline"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Create Account
                  </button>
                </form>
              </div>
              <div className="bg-blue-50 px-6 py-4 rounded-b-lg">
                <p className="text-sm text-blue-600 text-center">
                  Already have an account?{" "}
                  <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">
                    Log in
                  </button>
                </p>
                <div className='flex justify-center items-center'>
                {errors.submit && <p className="text-red-500 text-xs mt-1">{errors.submit}</p>}
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default SignUp;