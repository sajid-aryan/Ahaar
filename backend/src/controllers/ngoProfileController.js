import NGOProfile from '../models/NGOProfile.js';
import MoneyDonation from '../models/MoneyDonation.js';
import { User } from '../models/user.model.js';

// Get all public NGO profiles
export async function getAllNGOProfiles(req, res) {
  try {
    const profiles = await NGOProfile.find({ isPublic: true })
      .populate('ngoId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      profiles,
      count: profiles.length
    });
  } catch (error) {
    console.error('Error fetching NGO profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching NGO profiles',
      error: error.message
    });
  }
}

// Get NGO profile by ID
export async function getNGOProfileById(req, res) {
  try {
    const { id } = req.params;
    const profile = await NGOProfile.findById(id)
      .populate('ngoId', 'name email');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching NGO profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching NGO profile',
      error: error.message
    });
  }
}



// Get my NGO profile (for authenticated NGO user)
export async function getMyProfile(req, res) {
  try {
    const userId = req.userId; // From verifyToken middleware
    
    // Check if user is an NGO
    const user = await User.findById(userId);
    if (!user || user.userType !== 'ngo') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only NGOs can access this resource.'
      });
    }

    const profile = await NGOProfile.findOne({ ngoId: userId })
      .populate('ngoId', 'name email');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching my NGO profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching NGO profile',
      error: error.message
    });
  }
}

// Create NGO profile
export async function createNGOProfile(req, res) {
  try {
    const userId = req.userId; // From verifyToken middleware
    const {
      organizationName,
      description,
      location,
      contactInfo
    } = req.body;

    // Check if user is an NGO
    const user = await User.findById(userId);
    if (!user || user.userType !== 'ngo') {
      return res.status(403).json({
        success: false,
        message: 'Only NGOs can create profiles'
      });
    }

    // Check if profile already exists
    const existingProfile = await NGOProfile.findOne({ ngoId: userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'NGO profile already exists'
      });
    }

    const profile = new NGOProfile({
      ngoId: userId,
      organizationName,
      description,
      location,
      contactInfo: contactInfo || {},
      logo: req.file ? `/uploads/${req.file.filename}` : null,
      needs: []
    });

    await profile.save();

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating NGO profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating NGO profile',
      error: error.message
    });
  }
}

// Update NGO profile
export async function updateNGOProfile(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updateData = req.body;

    const profile = await NGOProfile.findById(id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    // Check if user owns this profile
    if (profile.ngoId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    // Update logo if new file uploaded
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    const updatedProfile = await NGOProfile.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('ngoId', 'name email');

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating NGO profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating NGO profile',
      error: error.message
    });
  }
}

// Add need to NGO profile
export async function addNeed(req, res) {
  try {
    const userId = req.userId;
    const { profileId } = req.params;
    const { type, description, targetAmount } = req.body;

    const profile = await NGOProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    // Check if user owns this profile
    if (profile.ngoId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only add needs to your own profile'
      });
    }

    const newNeed = {
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Need`, // Generate a title
      description,
      targetAmount: type === 'money' ? targetAmount : undefined,
      urgency: 'medium' // Default urgency
    };

    profile.needs.push(newNeed);
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error adding need:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding need',
      error: error.message
    });
  }
}

// Update need in NGO profile
export async function updateNeed(req, res) {
  try {
    const userId = req.userId;
    const { profileId, needId } = req.params;
    const updateData = req.body;

    const profile = await NGOProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    // Check if user owns this profile
    if (profile.ngoId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile needs'
      });
    }

    const need = profile.needs.id(needId);
    if (!need) {
      return res.status(404).json({
        success: false,
        message: 'Need not found'
      });
    }

    // Update need fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        need[key] = updateData[key];
      }
    });

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Need updated successfully',
      profile
    });
  } catch (error) {
    console.error('Error updating need:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating need',
      error: error.message
    });
  }
}

// Delete need from NGO profile
export async function deleteNeed(req, res) {
  try {
    const userId = req.userId;
    const { profileId, needId } = req.params;

    const profile = await NGOProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    // Check if user owns this profile
    if (profile.ngoId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own profile needs'
      });
    }

    profile.needs.pull(needId);
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error deleting need:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting need',
      error: error.message
    });
  }
}

// Make money donation
export async function makeMoneyDonation(req, res) {
  try {
    const userId = req.userId; // From verifyToken middleware - now required
    const { profileId, needId } = req.params;
    const { amount, message, paymentMethod } = req.body;

    console.log('Donation request received:', {
      userId,
      profileId,
      needId,
      amount,
      paymentMethod,
      message
    });

    // Validate required fields
    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid donation amount (minimum $1)'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please select a payment method'
      });
    }

    // Get authenticated user details
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(401).json({
        success: false,
        message: 'User authentication required to make donations'
      });
    }

    console.log('Authenticated user found:', { name: user.name, email: user.email });

    // Get NGO profile
    const profile = await NGOProfile.findById(profileId);
    if (!profile) {
      console.log('NGO profile not found for ID:', profileId);
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    console.log('NGO profile found:', profile.organizationName);

    // Check if user is trying to donate to their own profile
    if (profile.ngoId.toString() === userId.toString()) {
      console.log('User attempting to donate to their own profile');
      return res.status(400).json({
        success: false,
        message: 'You cannot donate to yourself'
      });
    }

    // Find the specific need
    const need = profile.needs.id(needId);
    if (!need) {
      console.log('Need not found for ID:', needId);
      return res.status(404).json({
        success: false,
        message: 'Need not found'
      });
    }

    console.log('Need found:', { type: need.type, description: need.description });

    if (need.type !== 'money') {
      return res.status(400).json({
        success: false,
        message: 'This need is not for money donations'
      });
    }

    // Generate mock transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('Creating donation record with transaction ID:', transactionId);

    // Create money donation record
    const donation = new MoneyDonation({
      donorId: userId,
      donorName: user.name,
      donorEmail: user.email,
      ngoId: profile.ngoId,
      ngoProfileId: profileId,
      needId: needId,
      amount: parseFloat(amount),
      message: message || '',
      paymentMethod,
      transactionId,
      isAnonymous: false // Always false since user must be logged in
    });

    await donation.save();
    console.log('Donation saved successfully');

    // Update the need's current amount
    need.currentAmount = (need.currentAmount || 0) + parseFloat(amount);
    
    // Update total donations received
    profile.totalDonationsReceived = (profile.totalDonationsReceived || 0) + parseFloat(amount);
    
    await profile.save();
    console.log('Profile updated with new donation amounts');

    // Update user's total money donated
    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalMoneyDonated: parseFloat(amount) } }
    );
    console.log('User total money donated updated');

    res.status(200).json({
      success: true,
      message: 'Donation successful!',
      donation,
      transactionId
    });
  } catch (error) {
    console.error('Error processing donation:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error processing donation: ' + error.message,
      error: error.message
    });
  }
}

// Get donations for an NGO
export async function getNGODonations(req, res) {
  try {
    const { ngoId } = req.params;
    
    const donations = await MoneyDonation.find({ ngoId })
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      donations,
      count: donations.length
    });
  } catch (error) {
    console.error('Error fetching NGO donations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donations',
      error: error.message
    });
  }
}
