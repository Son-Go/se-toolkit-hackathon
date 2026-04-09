const { pool } = require('../config/database');

class Course {
  static async create({ name, code, description, createdBy }) {
    const result = await pool.query(
      'INSERT INTO courses (name, code, description, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, code, description, createdBy]
    );
    
    // Add creator as owner
    await pool.query(
      'INSERT INTO course_members (user_id, course_id, role) VALUES ($1, $2, $3)',
      [createdBy, result.rows[0].id, 'owner']
    );
    
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT c.*, u.username as creator_name FROM courses c LEFT JOIN users u ON c.created_by = u.id WHERE c.id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query(
      'SELECT c.*, u.username as creator_name, COUNT(cm.user_id) as member_count FROM courses c LEFT JOIN users u ON c.created_by = u.id LEFT JOIN course_members cm ON c.id = cm.course_id GROUP BY c.id, u.username ORDER BY c.created_at DESC'
    );
    return result.rows;
  }

  static async getUserCourses(userId) {
    const result = await pool.query(
      'SELECT c.*, cm.role, u.username as creator_name FROM courses c JOIN course_members cm ON c.id = cm.course_id LEFT JOIN users u ON c.created_by = u.id WHERE cm.user_id = $1 ORDER BY c.created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async addMember(courseId, userId, role = 'member') {
    const result = await pool.query(
      'INSERT INTO course_members (user_id, course_id, role) VALUES ($1, $2, $3) ON CONFLICT (user_id, course_id) DO NOTHING RETURNING *',
      [userId, courseId, role]
    );
    return result.rows[0];
  }

  static async isMember(courseId, userId) {
    const result = await pool.query(
      'SELECT * FROM course_members WHERE course_id = $1 AND user_id = $2',
      [courseId, userId]
    );
    return result.rows.length > 0;
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM courses WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Course;
