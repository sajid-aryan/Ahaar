import express from 'express';
// import upload from '../middleware/upload.js';
import { 
  getAllDonations, 
  createDonation, 
  updateDonation, 
  deleteDonation, 
  getDonationById,
  getDonationsByUser,
  claimDonation,
  completeDonation
} from '../controllers/donationsController.js';

const router = express.Router();

// Get all donations
router.get('/', getAllDonations);

// Create new donation
// router.post('/', upload.single('image'), createDonation);

// Get donations by user
router.get('/my/:userId', getDonationsByUser);

// Claim a donation
router.post('/:id/claim', claimDonation);

// Complete a donation
router.post('/:id/complete', completeDonation);

// Get donation by ID
router.get('/:id', getDonationById);

// Update donation
router.put('/:id', updateDonation);

// Delete donation
router.delete('/:id', deleteDonation);

export default router;