const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const courseController = require('../controllers/courseController');
const { authMiddleware } = require('../middleware/auth');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// All routes require authentication
router.use(authMiddleware);

router.get('/', courseController.getAll);
router.get('/my', courseController.getMyCourses);
router.get('/:id', courseController.getById);

router.post('/', [
  body('name').trim().notEmpty().withMessage('Course name is required'),
  body('code').trim().notEmpty().withMessage('Course code is required')
], validate, courseController.create);

router.post('/:id/join', courseController.join);
router.delete('/:id', courseController.delete);

module.exports = router;
