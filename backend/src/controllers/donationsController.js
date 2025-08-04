import Donation from '../models/Donation.js';

// Get all donations (for browse page)
export async function getAllDonations(req, res) {
  try {
    const donations = await Donation.find({ status: { $ne: 'expired' } })
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
    
    donation.status = 'claimed';
    donation.claimerId = claimerId;
    donation.claimerName = claimerName;
    donation.claimedAt = new Date();
    
    await donation.save();
    
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

