import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 获取所有用户列表
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        username, 
        email, 
        created_at,
        status
      FROM users
      ORDER BY created_at ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    );
  }
} 