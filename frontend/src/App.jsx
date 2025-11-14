import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CreateDonationPage from './pages/CreateDonationPage.jsx'
import Welcome from './pages/Welcome.jsx'
import BrowsePage from './pages/BrowsePage.jsx'
import ClaimedDonationsPage from './pages/ClaimedDonationsPage.jsx'
import MyDonationsPage from './pages/MyDonationsPage.jsx'
import About from './pages/About.jsx'
import NGOProfilesPage from './pages/NGOProfilesPage.jsx'
import NGOProfileDetailPage from './pages/NGOProfileDetailPage.jsx'
import ManageNGOProfilePage from './pages/ManageNGOProfilePage.jsx'
import ManageUserProfilePage from './pages/ManageUserProfilePage.jsx'
import DonorProfilePage from './pages/DonorProfilePage.jsx'
import ComingSoonPage from './pages/ComingSoonPage.jsx'
import AdminDashboardPage from './pages/AdminDashboard.jsx'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import Chatbot from './components/Chatbot.jsx'
// import NotificationTester from './components/NotificationTester.jsx' // Commented out for production - uncomment to test notifications
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return children;
};

const AdminProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user || user.userType !== 'admin') {
		return <Navigate to='/' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated } = useAuthStore();

	if (isAuthenticated) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth, isAuthenticated } = useAuthStore();
	const location = useLocation();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	const pageTransition = {
		initial: { opacity: 0, x: 20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
		transition: { duration: 0.4, ease: "easeInOut" }
	};

	return (
		<div className="min-h-screen flex flex-col" data-theme="garden">
			<Navbar />
			<motion.main 
				className="flex-1"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<AnimatePresence mode="wait">
					<Routes location={location} key={location.pathname}>
						<Route
							path='/'
							element={
								<motion.div {...pageTransition}>
									<Welcome />
								</motion.div>
							}
						/>
						<Route 
							path="/about" 
							element={
								<motion.div {...pageTransition}>
									<About />
								</motion.div>
							} 
						/>
						<Route 
							path="/coming-soon" 
							element={
								<motion.div {...pageTransition}>
									<ComingSoonPage />
								</motion.div>
							} 
						/>
						<Route 
							path="/ngo-profiles" 
							element={
								<motion.div {...pageTransition}>
									<NGOProfilesPage />
								</motion.div>
							} 
						/>
						<Route 
							path="/ngo-profile/:id" 
							element={
								<motion.div {...pageTransition}>
									<NGOProfileDetailPage />
								</motion.div>
							} 
						/>
						<Route 
							path="/donor-profile/:donorId" 
							element={
								<motion.div {...pageTransition}>
									<DonorProfilePage />
								</motion.div>
							} 
						/>
						<Route 
							path="/manage-profile" 
							element={
								<ProtectedRoute>
									<motion.div {...pageTransition}>
										<ManageNGOProfilePage />
									</motion.div>
								</ProtectedRoute>
							} 
						/>
						<Route 
							path="/manage-user-profile" 
							element={
								<ProtectedRoute>
									<motion.div {...pageTransition}>
										<ManageUserProfilePage />
									</motion.div>
								</ProtectedRoute>
							} 
						/>
						<Route 
							path="/browse" 
							element={
								<ProtectedRoute>
									<motion.div {...pageTransition}>
										<BrowsePage />
									</motion.div>
								</ProtectedRoute>
							} 
						/>
						<Route 
							path="/claimed-donations" 
							element={
								<ProtectedRoute>
									<motion.div {...pageTransition}>
										<ClaimedDonationsPage />
									</motion.div>
								</ProtectedRoute>
							} 
						/>
						<Route 
							path="/my-donations" 
							element={
								<ProtectedRoute>
									<motion.div {...pageTransition}>
										<MyDonationsPage />
									</motion.div>
								</ProtectedRoute>
							} 
						/>
						<Route 
							path="/create-donation" 
							element={
								<ProtectedRoute>
									<motion.div {...pageTransition}>
										<CreateDonationPage />
									</motion.div>
								</ProtectedRoute>
							} 
						/>
						<Route 
							path="/admin" 
							element={
								<AdminProtectedRoute>
									<motion.div {...pageTransition}>
										<AdminDashboardPage />
									</motion.div>
								</AdminProtectedRoute>
							} 
						/>
						<Route
							path='/signup'
							element={
								<RedirectAuthenticatedUser>
									<motion.div {...pageTransition}>
										<SignUpPage />
									</motion.div>
								</RedirectAuthenticatedUser>
							}
						/>
						<Route
							path='/login'
							element={
								<RedirectAuthenticatedUser>
									<motion.div {...pageTransition}>
										<LoginPage />
									</motion.div>
								</RedirectAuthenticatedUser>
							}
						/>
						{/* catch all routes */}
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</AnimatePresence>
			</motion.main>
			<Footer />
			<Chatbot />
			
			{/* Notification Tester - Commented out for production */}
			{/* Uncomment the line below to enable notification testing */}
			{/* {isAuthenticated && <NotificationTester />} */}
			
			<Toaster />
		</div>
	);
}

export default App;