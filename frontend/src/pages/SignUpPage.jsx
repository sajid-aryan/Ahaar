import { motion } from "framer-motion";
import { useState } from "react";
import { User, Mail, Lock, Loader, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userType, setUserType] = useState("Individual");
	const navigate = useNavigate();

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();

		try {
			// Convert userType to lowercase to match backend enum
			const userTypeMapping = {
				'Individual': 'individual',
				'Restaurant': 'restaurant', 
				'NGO': 'ngo'
			};
			const mappedUserType = userTypeMapping[userType] || userType.toLowerCase();
			
			await signup(email, password, name, mappedUserType);
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<motion.div 
			className="relative min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 overflow-hidden flex items-center justify-center p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			{/* Enhanced Background Effects */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{/* Dynamic Gradient Orbs */}
				<motion.div
					className="absolute top-10 right-10 w-60 h-60 opacity-30"
					style={{
						background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)',
						borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
						filter: 'blur(40px)',
					}}
					animate={{ 
						rotate: [0, 360],
						borderRadius: [
							'60% 40% 30% 70% / 60% 30% 70% 40%',
							'40% 60% 70% 30% / 40% 70% 30% 60%',
							'30% 70% 40% 60% / 70% 40% 60% 30%',
							'60% 40% 30% 70% / 60% 30% 70% 40%'
						]
					}}
					transition={{ 
						duration: 20, 
						repeat: Infinity,
						ease: "linear"
					}}
				/>
				
				<motion.div
					className="absolute bottom-20 left-10 w-80 h-80 opacity-25"
					style={{
						background: 'radial-gradient(circle, #667eea 0%, #764ba2 50%, #f093fb 100%)',
						borderRadius: '30% 70% 40% 60% / 50% 60% 40% 50%',
						filter: 'blur(50px)',
					}}
					animate={{ 
						scale: [1, 1.2, 0.8, 1],
						rotate: [0, -360],
						borderRadius: [
							'30% 70% 40% 60% / 50% 60% 40% 50%',
							'70% 30% 60% 40% / 30% 50% 60% 50%',
							'40% 60% 30% 70% / 60% 40% 50% 60%',
							'30% 70% 40% 60% / 50% 60% 40% 50%'
						]
					}}
					transition={{ 
						duration: 25, 
						repeat: Infinity,
						ease: "easeInOut"
					}}
				/>

				{/* Floating Icons */}
				{['👥', '📝', '🏠', '❤️', '🎁', '✨'].map((icon, index) => (
					<motion.div
						key={index}
						className="absolute text-6xl opacity-15"
						style={{
							left: `${15 + (index * 12)}%`,
							top: `${25 + (index * 10)}%`,
						}}
						animate={{ 
							y: [0, -30, 0],
							rotate: [0, 360],
							scale: [1, 1.2, 1],
						}}
						transition={{ 
							duration: 8 + index * 2, 
							repeat: Infinity,
							ease: "easeInOut",
							delay: index * 0.7
						}}
					>
						{icon}
					</motion.div>
				))}

				{/* Sparkle Effects */}
				{Array.from({ length: 10 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							scale: [0, 1, 0],
							opacity: [0.6, 1, 0.6],
							rotate: [0, 180, 360],
						}}
						transition={{
							duration: 3 + Math.random() * 2,
							repeat: Infinity,
							ease: "easeInOut",
							delay: Math.random() * 2,
						}}
					/>
				))}
			</div>

			<div className="relative z-10 w-full max-w-md">
				{/* Ahaar Branding */}
				<motion.div
					className="text-center mb-8"
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					<motion.h1 
						className="text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
						animate={{ 
							backgroundPosition: ['0%', '100%', '0%'],
						}}
						transition={{ 
							duration: 4, 
							repeat: Infinity,
							ease: "linear"
						}}
						style={{
							backgroundSize: '200% 200%',
						}}
					>
						Ahaar
					</motion.h1>
					<motion.p 
						className="text-gray-600 text-lg"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						Join our community of givers
					</motion.p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className='w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden'
			>
				<div className='p-8'>
					<h2 className='text-3xl font-bold mb-6 text-center text-green-600'>
						Create Account
					</h2>

					<form onSubmit={handleSignUp}>
						<Input
							icon={User}
							type='text'
							placeholder='Full Name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<Input
							icon={Mail}
							type='email'
							placeholder='Email Address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							icon={Lock}
							type='password'
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						
						<div className='relative mb-6'>
							<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
								<Users className='size-5 text-green-500' />
							</div>
							<select
								value={userType}
								onChange={(e) => setUserType(e.target.value)}
								className='w-full pl-10 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-gray-900 transition duration-200'
							>
								<option value="Individual">Individual</option>
								<option value="NGO">NGO</option>
								<option value="Restaurant">Restaurant</option>
							</select>
						</div>

						{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
						<PasswordStrengthMeter password={password} />

						<motion.button
							className='mt-5 w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white transition duration-200'
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Sign Up"}
						</motion.button>
					</form>
				</div>
				<div className='px-8 py-4 bg-gray-50 flex justify-center'>
					<p className='text-sm text-gray-600'>
						Already have an account?{" "}
						<Link to={"/login"} className='text-green-600 hover:text-green-700 font-semibold hover:underline'>
							Login
						</Link>
					</p>
				</div>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default SignUpPage;