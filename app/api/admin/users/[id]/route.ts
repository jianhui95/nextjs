import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    // 开始事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 删除用户相关的所有数据
      //await connection.execute('DELETE FROM blocked_users WHERE user_id = ?', [userId]);
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

      // 提交事务
      await connection.commit();
      connection.release();

      return NextResponse.json({ message: '用户删除成功' });
    } catch (error) {
      // 如果出错，回滚事务
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    );
  }
} 