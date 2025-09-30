import { motion } from 'framer-motion';

const Input = ({ icon: Icon, ...props }) => {
	return (
		<motion.div 
			className='relative mb-6'
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10'>
				<Icon className='size-5 text-green-500' />
			</div>
			<motion.input
				{...props}
				className='w-full pl-10 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500 transition duration-200 relative z-0'
			/>
		</motion.div>
	);
};
export default Input;