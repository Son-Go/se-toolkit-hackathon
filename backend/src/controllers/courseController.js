const Course = require('../models/Course');

const courseController = {
  async create(req, res) {
    try {
      const { name, code, description } = req.body;

      if (!name || !code) {
        return res.status(400).json({ error: 'Name and code are required' });
      }

      const course = await Course.create({
        name,
        code,
        description: description || '',
        createdBy: req.user.id
      });

      res.status(201).json({
        message: 'Course created successfully',
        course
      });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  },

  async getAll(req, res) {
    try {
      const courses = await Course.findAll();
      res.json({ courses });
    } catch (error) {
      console.error('Get all courses error:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const isMember = await Course.isMember(id, req.user.id);
      if (!isMember) {
        return res.status(403).json({ error: 'You are not a member of this course' });
      }

      res.json({ course });
    } catch (error) {
      console.error('Get course error:', error);
      res.status(500).json({ error: 'Failed to fetch course' });
    }
  },

  async getMyCourses(req, res) {
    try {
      const courses = await Course.getUserCourses(req.user.id);
      res.json({ courses });
    } catch (error) {
      console.error('Get user courses error:', error);
      res.status(500).json({ error: 'Failed to fetch your courses' });
    }
  },

  async join(req, res) {
    try {
      const { id } = req.params;
      
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const isMember = await Course.isMember(id, req.user.id);
      if (isMember) {
        return res.status(400).json({ error: 'You are already a member of this course' });
      }

      await Course.addMember(id, req.user.id, 'member');

      res.json({
        message: 'Successfully joined the course',
        course
      });
    } catch (error) {
      console.error('Join course error:', error);
      res.status(500).json({ error: 'Failed to join course' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Only owner can delete
      if (course.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Only the course owner can delete' });
      }

      await Course.delete(id);

      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Delete course error:', error);
      res.status(500).json({ error: 'Failed to delete course' });
    }
  }
};

module.exports = courseController;
