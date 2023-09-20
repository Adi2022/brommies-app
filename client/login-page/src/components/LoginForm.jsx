import React, { useState } from "react";
import image from "../assets/image1.webp";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LoginForm = () => {
	const [userData, setUserData] = useState({
		firstname: "",
		lastname: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };
  const validateConfirmPassword = (password, confirmPassword) => {
    // Confirm Password validation logic (e.g., checking if it matches the password)
    return password === confirmPassword;
  };

  const PostData = async (e) => {
    e.preventDefault();
    const {
      email,
      password,
      firstname,
      lastname,
      username,
      confirmPassword,
    } = userData;
	if (!firstname.trim()) {
		toast.error("First Name is required");
		return;
	  }
  
	  if (!lastname.trim()) {
		toast.error("Last Name is required");
		return;
	  }
	 
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
	if (!validateEmail(email)) {
		toast.error("Invalid email address");
		return;
	  }
	  if (!username.trim()) {
		toast.error("Username is required");
		return;
	  }
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password should have at least 6 characters");
      return;
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstname,
          lastname,
          username,
          confirmPassword,
        }),
      });
      const data = await res.json();
	  
      if (data.error) {
        toast.error(<strong style={{ color: "red" }}>{data.error}</strong>);
      } else {
        toast.success("Registered successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

	
	

	return (
		<div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-4 m-20">
			{/* Left Grid (Image) */}

			<motion.div
				className="md:w-1/2 p-4 bg-gray-100"
				initial={{ x: -500, opacity: 0 }} // Initial state (hidden)
				animate={{ x: 0, opacity: 1 }} // Animation to make it visible
				transition={{ duration: 2 }} // Duration of the animation
			>
				<img src={image} alt="User's image" className="h-full mx-auto md:mx-0" />
			</motion.div>

			{/* Right Grid (User Form) */}
			<motion.div
				className="md:w-1/2 p-4 "
				initial={{ x: 500 }} // Initial position (right side of the screen)
				animate={{ x: 0 }} // Animation state (move to the center)
				transition={{ duration: 2 }} // Animation duration in seconds
			>
				<h2 className="text-xl font-semibold mb-4 text-violet-700">Explore & Experience</h2>
				<p className=" mb-4 font-semibold text-violet-700">
					Get onto your most comfortable journey yet. All the way up.
				</p>
				<form>
					<div className="mb-4 flex justify-between">
						<div className="">
							<input
								type="text"
								name="firstname"
								value={userData.firstname}
								className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
								placeholder="First Name"
								onChange={handleInput}
							/>
						</div>

						<div className="ml-2">
							<input
								type="text"
								name="lastname"
								value={userData.lastname}
								className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
								placeholder="Last Name"
								onChange={handleInput}
							/>
						</div>
					</div>

					{/* Email Field */}
					<div className="mb-4">
						<input
							type="text"
							name="email"
							value={userData.email}
							className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
							placeholder="Email"
							onChange={handleInput}
						/>
					</div>

					{/* Username Field */}
					<div className="mb-4">
						<input
							type="text"
							name="username"
							value={userData.username}
							className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
							placeholder="Username"
							onChange={handleInput}
						/>
					</div>

					{/* Password Field */}
					<div className="mb-4">
						<input
							type="text"
							name="password"
							value={userData.password}
							className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
							placeholder="Password"
							onChange={handleInput}
						/>
					</div>

					{/* Confirm Password Field */}
					<div className="mb-4">
						<input
							type="text"
							name="confirmPassword"
							value={userData.confirmPassword}
							className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
							placeholder="Confirm Password"
							onChange={handleInput}
						/>
					</div>

					<div className="mt-4">
						<button
							type="submit"
							value="register"
							onClick={PostData}
							className=" w-full text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 bg-violet-700 uppercase font-semibold"
						>
							Get Started
						</button>
					</div>
				</form>
			</motion.div>
			<ToastContainer
        position="top-right"
        autoClose={200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
		</div>
	);
};

export default LoginForm;