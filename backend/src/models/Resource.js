const { pool } = require('../config/database');

class Resource {
  static async create({ title, description, filePath, fileType, fileSize, courseId, uploadedBy, tags = [] }) {
    const result = await pool.query(
      'INSERT INTO resources (title, description, file_path, file_type, file_size, course_id, uploaded_by, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, filePath, fileType, fileSize, courseId, uploadedBy, tags]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT r.*, u.username as uploader_name FROM resources r LEFT JOIN users u ON r.uploaded_by = u.id WHERE r.id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByCourseId(courseId, { search, fileType, tag, sortBy = 'created_at', order = 'DESC' } = {}) {
    let query = `
      SELECT r.*, u.username as uploader_name 
      FROM resources r 
      LEFT JOIN users u ON r.uploaded_by = u.id 
      WHERE r.course_id = $1
    `;
    const params = [courseId];
    let paramCount = 1;

    if (search) {
      paramCount++;
      query += ` AND (r.title ILIKE $${paramCount} OR r.description ILIKE $${paramCount} OR r.tags::text ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (fileType) {
      paramCount++;
      query += ` AND r.file_type = $${paramCount}`;
      params.push(fileType);
    }

    if (tag) {
      paramCount++;
      query += ` AND $${paramCount} = ANY(r.tags)`;
      params.push(tag);
    }

    const validSortColumns = ['created_at', 'title', 'file_type'];
    const validOrders = ['ASC', 'DESC'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    query += ` ORDER BY r.${sortColumn} ${sortOrder}`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
    const result = await pool.query(
      `UPDATE resources SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM resources WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Resource;
