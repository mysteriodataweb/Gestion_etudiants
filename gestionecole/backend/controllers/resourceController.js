import pool from '../db.js';

const buildPayload = (body, fields) => {
  return fields.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field] === '' ? null : body[field];
    }
    return payload;
  }, {});
};

const buildInsertSQL = (table, payload) => {
  const columns = Object.keys(payload);
  if (columns.length === 0) return null;
  
  const columnList = columns.join(', ');
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map(col => payload[col]);
  
  return {
    sql: `INSERT INTO ${table} (${columnList}) VALUES (${placeholders})`,
    values
  };
};

const buildUpdateSQL = (table, payload) => {
  const columns = Object.keys(payload);
  if (columns.length === 0) return null;
  
  const setClause = columns.map(col => `${col} = ?`).join(', ');
  const values = columns.map(col => payload[col]);
  
  return {
    sql: `UPDATE ${table} SET ${setClause} WHERE id = ?`,
    values
  };
};

export function createResourceController(config) {
  const selectClause = config.select || `${config.table}.*`;
  const fromClause = `${config.table} ${config.joins || ''}`;
  const orderByClause = config.orderBy || `${config.table}.id DESC`;

  return {
    async list(req, res, next) {
      try {
        const [rows] = await pool.query(`SELECT ${selectClause} FROM ${fromClause} ORDER BY ${orderByClause}`);
        res.json(rows);
      } catch (error) {
        next(error);
      }
    },

    async getById(req, res, next) {
      try {
        const [rows] = await pool.query(`SELECT ${selectClause} FROM ${fromClause} WHERE ${config.table}.id = ?`, [req.params.id]);
        if (!rows[0]) {
          return res.status(404).json({ message: 'Ressource introuvable.' });
        }
        return res.json(rows[0]);
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      try {
        const payload = buildPayload(req.body, config.fields);
        
        if (!Object.keys(payload).length) {
          return res.status(400).json({ message: 'Aucune donnee valide fournie.' });
        }
        
        const insertSQL = buildInsertSQL(config.table, payload);
        if (!insertSQL) {
          return res.status(400).json({ message: 'Aucune donnee valide fournie.' });
        }
        
        const [result] = await pool.query(insertSQL.sql, insertSQL.values);
        
        // Build WHERE clause based on primaryKey config or default to id
        let whereClause;
        let whereValues;
        if (config.primaryKey && Array.isArray(config.primaryKey)) {
          whereClause = config.primaryKey.map(key => `${config.table}.${key} = ?`).join(' AND ');
          whereValues = config.primaryKey.map(key => payload[key]);
        } else {
          whereClause = `${config.table}.id = ?`;
          whereValues = [result.insertId];
        }
        
        const [rows] = await pool.query(`SELECT ${selectClause} FROM ${fromClause} WHERE ${whereClause}`, whereValues);
        return res.status(201).json(rows[0]);
      } catch (error) {
        // Handle duplicate entry or constraint violation errors
        if (error.code === 'ER_DUP_ENTRY' || error.sqlState === '23000') {
          return res.status(409).json({ message: 'Une donnee identique existe deja.' });
        }
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        const payload = buildPayload(req.body, config.fields);
        
        if (!Object.keys(payload).length) {
          return res.status(400).json({ message: 'Aucune donnee valide fournie.' });
        }
        
        const updateSQL = buildUpdateSQL(config.table, payload);
        if (!updateSQL) {
          return res.status(400).json({ message: 'Aucune donnee valide fournie.' });
        }
        
        const [result] = await pool.query(updateSQL.sql, [...updateSQL.values, req.params.id]);
        if (!result.affectedRows) {
          return res.status(404).json({ message: 'Ressource introuvable.' });
        }
        const [rows] = await pool.query(`SELECT ${selectClause} FROM ${fromClause} WHERE ${config.table}.id = ?`, [req.params.id]);
        return res.json(rows[0]);
      } catch (error) {
        next(error);
      }
    },

    async remove(req, res, next) {
      try {
        const [result] = await pool.query(`DELETE FROM ${config.table} WHERE id = ?`, [req.params.id]);
        if (!result.affectedRows) {
          return res.status(404).json({ message: 'Ressource introuvable.' });
        }
        return res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}
