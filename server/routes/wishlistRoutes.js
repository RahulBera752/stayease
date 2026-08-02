import express from 'express';
const router = express.Router();

// TODO: wishlist routes will be implemented in the backend logic step
router.get('/', (req, res) => {
  res.json({ success: true, message: 'wishlist route placeholder' });
});

export default router;
