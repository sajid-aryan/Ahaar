import Donation from '../models/Donation.js';

// Function for checking and updating expired donations
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

// Start checking every minute expired donations 
export const startExpiryChecker = () => {
  // Check immediately on startup
  checkExpiredDonations();
  
  // Check every minute
  setInterval(checkExpiredDonations, 60000); // 60000ms = 1 minute
  
  console.log('Donation expiry checker started - checking every minute');
};
