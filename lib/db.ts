import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'nextjs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
    try {
      const connection = await pool.getConnection();
      console.log('✅ MySQL 连接成功');
      const [rows] = await connection.query('SELECT 1');
      console.log('✅ MySQL 查询测试成功');
      connection.release();
    } catch (error) {
      console.error('❌ MySQL 连接失败:', error);
    }
  })();

export default pool;