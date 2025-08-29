import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import Chatbot from './components/Chatbot.jsx'
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

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated } = useAuthStore();

	if (isAuthenticated) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<div className="min-h-screen flex flex-col" data-theme="garden">
			<Navbar />
			<main className="flex-1">
				<Routes>
					<Route
						path='/'
						element={<Welcome />}
					/>
					<Route path="/about" element={<About />} />
					<Route path="/ngo-profiles" element={<NGOProfilesPage />} />
					<Route path="/ngo-profile/:id" element={<NGOProfileDetailPage />} />
					<Route 
						path="/manage-profile" 
						element={
							<ProtectedRoute>
								<ManageNGOProfilePage />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/manage-user-profile" 
						element={
							<ProtectedRoute>
								<ManageUserProfilePage />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/browse" 
						element={
							<ProtectedRoute>
								<BrowsePage />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/claimed-donations" 
						element={
							<ProtectedRoute>
								<ClaimedDonationsPage />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/my-donations" 
						element={
							<ProtectedRoute>
								<MyDonationsPage />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/create-donation" 
						element={
							<ProtectedRoute>
								<CreateDonationPage />
							</ProtectedRoute>
						} 
					/>
					<Route
						path='/signup'
						element={
							<RedirectAuthenticatedUser>
								<SignUpPage />
							</RedirectAuthenticatedUser>
						}
					/>
					<Route
						path='/login'
						element={
							<RedirectAuthenticatedUser>
								<LoginPage />
							</RedirectAuthenticatedUser>
						}
					/>
					{/* catch all routes */}
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</main>
			<Footer />
			<Chatbot />
			<Toaster />
		</div>
	);
}

export default App;