import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const params = await context.params; // 显式 await
    const userId = parseInt(params.id);
    console.log(status);
    console.log(userId);
    // 更新用户状态
    await pool.execute(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, userId]
    );

    return NextResponse.json({ message: '用户状态更新成功' });
  } catch (error) {
    console.error('更新用户状态失败:', error);
    return NextResponse.json(
      { error: '更新用户状态失败' },
      { status: 500 }
    );
  }
} 