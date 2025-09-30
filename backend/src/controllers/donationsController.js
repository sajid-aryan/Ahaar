import Donation from '../models/Donation.js';
import { User } from '../models/user.model.js';
import { createNotification } from './notificationController.js';

// Get all donations (for browse page)
export async function getAllDonations(req, res) {
  try {
    // First, update any expired donations
    await Donation.updateMany(
      {
        expiryDate: { $lte: new Date() },
        status: 'available'
      },
      {
        $set: { status: 'expired' }
      }
    );

    // Then fetch only available donations (exclude claimed, completed, and expired)
    const donations = await Donation.find({ status: 'available' })
      .sort({ createdAt: -1 })
      .populate('donorId', 'name userType averageRating totalRatings')
      .populate('claimerId', 'name userType');
    
    res.status(200).json({ 
      success: true, 
      donations,
      count: donations.length 
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching donations', 
      error: error.message 
    });
  }
}

// Create new donation
export async function createDonation(req, res) {
  try {
    console.log('Creating donation with data:', req.body);
    console.log('Uploaded file:', req.file);
    
    const donationData = {
      ...req.body,
      status: 'available'
    };

    // Add image URL if file was uploaded
    if (req.file) {
      donationData.image = `/uploads/${req.file.filename}`;
    }

    const newDonation = new Donation(donationData);
    await newDonation.save();
      
    res.status(201).json({ 
      success: true, 
      message: 'Donation created successfully',
      donation: newDonation 
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error creating donation', 
      error: error.message 
    });
  }
}

// Get donations by user (for my donations page)
export async function getDonationsByUser(req, res) {
  try {
    const { userId } = req.params;
    
    // First, update any expired donations
    await Donation.updateMany(
      {
        donorId: userId,
        expiryDate: { $lte: new Date() },
        status: 'available'
      },
      {
        $set: { status: 'expired' }
      }
    );

    // Then fetch all donations by this user
    const donations = await Donation.find({ donorId: userId })
      .sort({ createdAt: -1 })
      .populate('claimerId', 'name userType');
    
    res.status(200).json({ 
      success: true, 
      donations,
      count: donations.length 
    });
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching your donations', 
      error: error.message 
    });
  }
}

// Get claimed donations by NGO (for NGO claimed donations history)
export async function getClaimedDonationsByNGO(req, res) {
  try {
    const { ngoId } = req.params;
    const donations = await Donation.find({ 
      claimerId: ngoId,
      status: { $in: ['claimed', 'completed'] }
    })
      .sort({ claimedAt: -1 })
      .populate('donorId', 'name userType');
    
    res.status(200).json({ 
      success: true, 
      donations,
      count: donations.length 
    });
  } catch (error) {
    console.error('Error fetching claimed donations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching claimed donations', 
      error: error.message 
    });
  }
}

// Claim a donation (for NGOs)
export async function claimDonation(req, res) {
  try {
    const { id } = req.params;
    const { claimerId, claimerName } = req.body;
    
    const donation = await Donation.findById(id);
    
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    
    if (donation.status !== 'available') {
      return res.status(400).json({ 
        success: false, 
        message: 'This donation is no longer available' 
      });
    }
    
    // Check if the NGO is trying to claim their own donation
    if (donation.donorId.toString() === claimerId.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot claim your own donation' 
      });
    }
    
    donation.status = 'claimed';
    donation.claimerId = claimerId;
    donation.claimerName = claimerName;
    donation.claimedAt = new Date();
    
    await donation.save();
    
    // Create notification for the donor
    try {
      await createNotification({
        userId: donation.donorId,
        type: 'donation_claimed',
        title: '🎉 Your donation has been claimed!',
        message: `Great news! ${claimerName} has claimed your "${donation.title}" donation. They will be in touch for pickup arrangements.`,
        data: {
          donationId: donation._id,
          claimerId: claimerId,
          claimerName: claimerName
        }
      });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't fail the donation claim if notification fails
    }
    
    // Increment the donor's donations count when their donation is claimed
    if (donation.donorId) {
      await User.findByIdAndUpdate(
        donation.donorId,
        { $inc: { donationsCount: 1 } }
      );
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Donation claimed successfully',
      donation 
    });
  } catch (error) {
    console.error('Error claiming donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error claiming donation', 
      error: error.message 
    });
  }
}

// Update donation
export async function updateDonation(req, res) {
  try {
    const { id } = req.params;
    const updatedDonation = await Donation.findByIdAndUpdate(id, req.body, { 
      new: true,
      runValidators: true 
    });
    
    if (!updatedDonation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Donation updated successfully',
      donation: updatedDonation 
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error updating donation', 
      error: error.message 
    });
  }
}

// Delete donation
export async function deleteDonation(req, res) {
  try {
    const { id } = req.params;
    const deletedDonation = await Donation.findByIdAndDelete(id);
    
    if (!deletedDonation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Donation deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting donation', 
      error: error.message 
    });
  }
}

// Get donation by ID
export async function getDonationById(req, res) {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id)
      .populate('donorId', 'name userType email')
      .populate('claimerId', 'name userType email');
      
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      donation 
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching donation', 
      error: error.message 
    });
  }
}

// Mark donation as completed
export async function completeDonation(req, res) {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id);
    
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    
    if (donation.status !== 'claimed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only claimed donations can be marked as completed' 
      });
    }
    
    donation.status = 'completed';
    donation.completedAt = new Date();
    await donation.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Donation marked as completed',
      donation 
    });
  } catch (error) {
    console.error('Error completing donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error completing donation', 
      error: error.message 
    });
  }
}

// Like/Unlike a donation
export async function likeDonation(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId; // From verifyToken middleware
    
    const donation = await Donation.findById(id);
    
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    
    // Check if user has already liked this donation
    const hasLiked = donation.likedBy.includes(userId);
    
    if (hasLiked) {
      // Unlike the donation - use updateOne to avoid validation issues
      await Donation.updateOne(
        { _id: id },
        { 
          $pull: { likedBy: userId },
          $inc: { likes: -1 }
        }
      );
      
      // Fetch updated donation
      const updatedDonation = await Donation.findById(id);
      
      res.status(200).json({ 
        success: true, 
        message: 'Donation unliked',
        donation: updatedDonation,
        hasLiked: false
      });
    } else {
      // Like the donation - use updateOne to avoid validation issues
      await Donation.updateOne(
        { _id: id },
        { 
          $push: { likedBy: userId },
          $inc: { likes: 1 }
        }
      );
      
      // Fetch updated donation
      const updatedDonation = await Donation.findById(id);
      
      res.status(200).json({ 
        success: true, 
        message: 'Donation liked',
        donation: updatedDonation,
        hasLiked: true
      });
    }
  } catch (error) {
    console.error('Error liking donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing like', 
      error: error.message 
    });
  }
}

// Submit feedback for a completed donation (NGO only)
export async function submitFeedback(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId; // From verifyToken middleware
    
    const donation = await Donation.findById(id);
    
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    
    // Check if the donation was claimed by this NGO
    if (donation.claimerId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only provide feedback for donations you claimed' 
      });
    }
    
    // Check if donation is claimed or completed
    if (donation.status !== 'claimed' && donation.status !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Feedback can only be submitted for claimed or completed donations' 
      });
    }
    
    // Check if feedback already exists
    if (donation.feedback && donation.feedback.ngoRating) {
      return res.status(400).json({ 
        success: false, 
        message: 'Feedback has already been submitted for this donation' 
      });
    }
    
    // Add feedback
    donation.feedback = {
      ngoRating: rating,
      ngoComment: comment || '',
      feedbackDate: new Date()
    };
    
    await donation.save();
    
    // Update donor's rating statistics
    const donor = await User.findById(donation.donorId);
    if (donor) {
      donor.ratingSum += rating;
      donor.totalRatings += 1;
      donor.averageRating = donor.ratingSum / donor.totalRatings;
      await donor.save();
    }
    
    // Create notification for the donor about receiving feedback
    try {
      const ngo = await User.findById(userId);
      const ratingText = rating === 5 ? '🌟 Excellent' : 
                        rating === 4 ? '⭐ Very Good' : 
                        rating === 3 ? '👍 Good' : 
                        rating === 2 ? '👎 Fair' : '😞 Poor';
      
      await createNotification({
        userId: donation.donorId,
        type: 'feedback_received',
        title: `⭐ New feedback from ${ngo?.name || 'an NGO'}!`,
        message: `You received a ${ratingText} (${rating}/5) rating for your "${donation.title}" donation. ${comment ? 'They also left a comment: "' + comment + '"' : 'Thank you for your contribution!'}`,
        data: {
          donationId: donation._id,
          claimerId: userId,
          claimerName: ngo?.name || 'NGO',
          rating: rating,
          feedback: comment || ''
        }
      });
    } catch (notificationError) {
      console.error('Error creating feedback notification:', notificationError);
      // Don't fail the feedback submission if notification fails
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      donation 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting feedback', 
      error: error.message 
    });
  }
}

// Get donor profile with ratings and reviews
export async function getDonorProfile(req, res) {
  try {
    const { donorId } = req.params;
    console.log('Fetching donor profile for ID:', donorId);
    
    // Get donor information
    const donor = await User.findById(donorId).select('name userType averageRating totalRatings donationsCount totalMoneyDonated createdAt');
    
    if (!donor) {
      console.log('Donor not found for ID:', donorId);
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }
    
    console.log('Donor found:', donor.name);
    
    // Get donations with feedback for this donor (both claimed and completed)
    const donationsWithFeedback = await Donation.find({
      donorId: donorId,
      $or: [
        { status: 'completed' },
        { status: 'claimed' }
      ],
      'feedback.ngoRating': { $exists: true }
    })
    .populate('claimerId', 'name userType')
    .select('title description category feedback claimerId claimedAt completedAt')
    .sort({ 'feedback.feedbackDate': -1 });
    
    console.log('Found reviews:', donationsWithFeedback.length);
    donationsWithFeedback.forEach((donation, index) => {
      console.log(`Review ${index + 1}:`, {
        title: donation.title,
        rating: donation.feedback?.ngoRating,
        comment: donation.feedback?.ngoComment,
        ngoName: donation.claimerId?.name,
        feedbackDate: donation.feedback?.feedbackDate
      });
    });
    
    // Get total donations with feedback count (both claimed and completed)
    const totalDonationsWithFeedback = await Donation.countDocuments({
      donorId: donorId,
      $or: [
        { status: 'completed' },
        { status: 'claimed' }
      ],
      'feedback.ngoRating': { $exists: true }
    });
    
    console.log('Total donations with feedback:', totalDonationsWithFeedback);
    
    res.status(200).json({
      success: true,
      donor: {
        ...donor.toObject(),
        completedDonationsCount: totalDonationsWithFeedback
      },
      reviews: donationsWithFeedback,
      reviewCount: donationsWithFeedback.length
    });
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donor profile',
      error: error.message
    });
  }
}

// Utility function to recalculate all donor ratings
export async function recalculateDonorRatings(req, res) {
  try {
    console.log('Starting donor ratings recalculation...');
    
    // Get all users who are donors (not NGOs)
    const donors = await User.find({ 
      userType: { $in: ['individual', 'restaurant'] }
    });
    
    console.log(`Found ${donors.length} donors to recalculate`);
    
    for (const donor of donors) {
      // Get all donations with feedback for this donor
      const donationsWithFeedback = await Donation.find({
        donorId: donor._id,
        'feedback.ngoRating': { $exists: true }
      });
      
      if (donationsWithFeedback.length > 0) {
        // Calculate new ratings
        const totalRatings = donationsWithFeedback.length;
        const ratingSum = donationsWithFeedback.reduce((sum, donation) => {
          return sum + (donation.feedback?.ngoRating || 0);
        }, 0);
        const averageRating = ratingSum / totalRatings;
        
        // Update donor
        await User.findByIdAndUpdate(donor._id, {
          totalRatings: totalRatings,
          ratingSum: ratingSum,
          averageRating: averageRating
        });
        
        console.log(`Updated ${donor.name}: ${totalRatings} ratings, average: ${averageRating.toFixed(2)}`);
      } else {
        // Reset ratings if no feedback
        await User.findByIdAndUpdate(donor._id, {
          totalRatings: 0,
          ratingSum: 0,
          averageRating: 0
        });
        
        console.log(`Reset ratings for ${donor.name} (no feedback found)`);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Donor ratings recalculated successfully',
      processedDonors: donors.length
    });
  } catch (error) {
    console.error('Error recalculating donor ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Error recalculating donor ratings',
      error: error.message
    });
  }
}

