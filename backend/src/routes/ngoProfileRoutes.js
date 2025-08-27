import express from 'express';
import upload from '../middleware/upload.js';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  getAllNGOProfiles,
  getNGOProfileById,
  getNGOProfileByUserId,
  getMyProfile,
  createNGOProfile,
  updateNGOProfile,
  addNeed,
  updateNeed,
  deleteNeed,
  makeMoneyDonation,
  getNGODonations
} from '../controllers/ngoProfileController.js';

const router = express.Router();

// Public routes
router.get('/public', getAllNGOProfiles);
router.get('/public/:id', getNGOProfileById);
router.get('/user/:ngoId', getNGOProfileByUserId);

// Protected routes
router.get('/my-profile', verifyToken, getMyProfile);
router.post('/', verifyToken, upload.single('logo'), createNGOProfile);
router.put('/:id', verifyToken, upload.single('logo'), updateNGOProfile);

// Need management routes
router.post('/:profileId/needs', verifyToken, addNeed);
router.put('/:profileId/needs/:needId', verifyToken, updateNeed);
router.delete('/:profileId/needs/:needId', verifyToken, deleteNeed);

// Money donation routes
router.post('/:profileId/needs/:needId/donate', verifyToken, makeMoneyDonation);
router.get('/:ngoId/donations', verifyToken, getNGODonations);

export default router;
