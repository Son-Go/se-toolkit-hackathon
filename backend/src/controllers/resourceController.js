const Resource = require('../models/Resource');
const Comment = require('../models/Comment');
const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');

const resourceController = {
  async create(req, res) {
    try {
      const { title, description, courseId, tags } = req.body;

      if (!title || !courseId) {
        return res.status(400).json({ error: 'Title and course ID are required' });
      }

      const isMember = await Course.isMember(courseId, req.user.id);
      if (!isMember) {
        return res.status(403).json({ error: 'You must be a member of this course' });
      }

      let filePath = null;
      let fileType = 'link';
      let fileSize = 0;

      if (req.file) {
        filePath = req.file.path;
        fileType = req.file.mimetype;
        fileSize = req.file.size;
      } else if (req.body.link) {
        filePath = req.body.link;
        fileType = 'link';
      }

      const tagsArray = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [];

      const resource = await Resource.create({
        title,
        description: description || '',
        filePath,
        fileType,
        fileSize,
        courseId,
        uploadedBy: req.user.id,
        tags: tagsArray
      });

      res.status(201).json({
        message: 'Resource uploaded successfully',
        resource
      });
    } catch (error) {
      console.error('Upload resource error:', error);
      res.status(500).json({ error: 'Failed to upload resource' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, tags } = req.body;

      const resource = await Resource.findById(id);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (resource.uploaded_by !== req.user.id) {
        return res.status(403).json({ error: 'You can only edit your own resources' });
      }

      const tagsArray = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : resource.tags;

      const updated = await Resource.update(id, {
        title: title || resource.title,
        description: description !== undefined ? description : resource.description,
        tags: tagsArray
      });

      res.json({
        message: 'Resource updated successfully',
        resource: updated
      });
    } catch (error) {
      console.error('Update resource error:', error);
      res.status(500).json({ error: 'Failed to update resource' });
    }
  },

  async getByCourse(req, res) {
    try {
      const { courseId } = req.params;
      const { search, fileType, tag, sortBy, order } = req.query;

      const isMember = await Course.isMember(courseId, req.user.id);
      if (!isMember) {
        return res.status(403).json({ error: 'You must be a member of this course' });
      }

      const resources = await Resource.findByCourseId(courseId, {
        search,
        fileType,
        tag,
        sortBy,
        order
      });

      res.json({ resources });
    } catch (error) {
      console.error('Get resources error:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const resource = await Resource.findById(id);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      const isMember = await Course.isMember(resource.course_id, req.user.id);
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const comments = await Comment.findByResourceId(id);

      res.json({ resource, comments });
    } catch (error) {
      console.error('Get resource error:', error);
      res.status(500).json({ error: 'Failed to fetch resource' });
    }
  },

  async download(req, res) {
    try {
      const { id } = req.params;

      const resource = await Resource.findById(id);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      const token = req.headers.authorization?.split(' ')[1] || req.query.token;
      
      if (token) {
        const jwt = require('jsonwebtoken');
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const isMember = await Course.isMember(resource.course_id, decoded.id);
          if (!isMember) {
            return res.status(403).json({ error: 'Access denied' });
          }
        } catch (err) {
          return res.status(401).json({ error: 'Invalid token' });
        }
      }

      if (!resource.file_path || resource.file_type === 'link') {
        return res.status(400).json({ error: 'No file to download' });
      }

      const filePath = path.resolve(resource.file_path);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found on server' });
      }

      res.download(filePath, resource.title);
    } catch (error) {
      console.error('Download resource error:', error);
      res.status(500).json({ error: 'Failed to download resource' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const resource = await Resource.findById(id);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (resource.uploaded_by !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete your own resources' });
      }

      if (resource.file_path && resource.file_type !== 'link') {
        const filePath = path.resolve(resource.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await Resource.delete(id);

      res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
      console.error('Delete resource error:', error);
      res.status(500).json({ error: 'Failed to delete resource' });
    }
  },

  async addComment(req, res) {
    try {
      const { resourceId } = req.params;
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      const comment = await Comment.create({
        content,
        resourceId,
        userId: req.user.id
      });

      res.status(201).json({
        message: 'Comment added successfully',
        comment
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  },

  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.delete(commentId, req.user.id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found or access denied' });
      }

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  }
};

module.exports = resourceController;
