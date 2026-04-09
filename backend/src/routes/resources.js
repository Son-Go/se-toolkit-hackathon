const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const resourceController = require('../controllers/resourceController');

// Public download route (accepts token via query param for embeds)
router.get('/:id/download', resourceController.download);

// All other routes require authentication
router.use(authMiddleware);

// Resource CRUD
router.post('/', upload.single('file'), resourceController.create);
router.get('/course/:courseId', resourceController.getByCourse);
router.get('/:id', resourceController.getById);
router.put('/:id', resourceController.update);
router.delete('/:id', resourceController.delete);

// Comments
router.post('/:resourceId/comments', resourceController.addComment);
router.delete('/comments/:commentId', resourceController.deleteComment);

module.exports = router;
