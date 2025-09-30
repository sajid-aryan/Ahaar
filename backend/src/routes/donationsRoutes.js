import express from 'express';
import upload from '../middleware/upload.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { 
  getAllDonations, 
  createDonation, 
  updateDonation, 
  deleteDonation, 
  getDonationById,
  getDonationsByUser,
  claimDonation,
  completeDonation,
  getClaimedDonationsByNGO,
  likeDonation,
  submitFeedback,
  getDonorProfile,
  recalculateDonorRatings
} from '../controllers/donationsController.js';

const router = express.Router();

// Get all donations
router.get('/', getAllDonations);

// Create new donation
router.post('/', upload.single('image'), createDonation);

// Get donations by user
router.get('/my/:userId', getDonationsByUser);

// Get claimed donations by NGO
router.get('/claimed/:ngoId', getClaimedDonationsByNGO);

// Claim a donation
router.post('/:id/claim', verifyToken, claimDonation);

// Complete a donation
router.post('/:id/complete', verifyToken, completeDonation);

// Like/Unlike a donation
router.post('/:id/like', verifyToken, likeDonation);

// Submit feedback for a completed donation
router.post('/:id/feedback', verifyToken, submitFeedback);

// Get donor profile with ratings and reviews
router.get('/donor/:donorId', getDonorProfile);

// Utility: Recalculate all donor ratings (admin use)
router.post('/admin/recalculate-ratings', recalculateDonorRatings);

// Get donation by ID
router.get('/:id', getDonationById);

// Update donation
router.put('/:id', updateDonation);

// Delete donation
router.delete('/:id', deleteDonation);

export default router;