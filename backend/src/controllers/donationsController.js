import Donation from '../models/Donation.js';
import User from '../models/user.model.js';

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
      .populate('donorId', 'name userType')
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
    
    // Note: We no longer increment donationsCount here
    // It will be incremented when the donation is claimed
    
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

