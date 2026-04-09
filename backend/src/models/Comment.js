const { pool } = require('../config/database');

class Comment {
  static async create({ content, resourceId, userId }) {
    const result = await pool.query(
      `INSERT INTO comments (content, resource_id, user_id) 
       VALUES ($1, $2, $3) 
       RETURNING id, content, resource_id, user_id, created_at`,
      [content, resourceId, userId]
    );
    
    const comment = result.rows[0];
    
    // Get the username for this comment
    const userResult = await pool.query(
      'SELECT username FROM users WHERE id = $1',
      [userId]
    );
    
    return {
      ...comment,
      username: userResult.rows[0]?.username || 'Anonymous'
    };
  }

  static async findByResourceId(resourceId) {
    const result = await pool.query(
      'SELECT c.*, u.username FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.resource_id = $1 ORDER BY c.created_at ASC',
      [resourceId]
    );
    return result.rows;
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = Comment;
