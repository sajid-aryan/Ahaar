import Donation from '../models/Donation.js';

// Function to check and update expired donations
export const checkExpiredDonations = async () => {
  try {
    const result = await Donation.updateMany(
      {
        expiryDate: { $lte: new Date() },
        status: 'available'
      },
      {
        $set: { status: 'expired' }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`Updated ${result.modifiedCount} expired donations`);
    }
  } catch (error) {
    console.error('Error checking expired donations:', error);
  }
};

// Start periodic checks for expired donations (every minute)
export const startExpiryChecker = () => {
  // Check immediately on startup
  checkExpiredDonations();
  
  // Then check every minute
  setInterval(checkExpiredDonations, 60000); // 60000ms = 1 minute
  
  console.log('Donation expiry checker started - checking every minute');
};
