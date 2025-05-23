import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 获取所有被封禁的IP
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM blocked_ips');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('获取封禁IP列表失败:', error);
    return NextResponse.json(
      { error: '获取封禁IP列表失败' },
      { status: 500 }
    );
  }
}

// 添加新的封禁IP
export async function POST(request: Request) {
  try {
    const { ip, reason } = await request.json();

    // 检查IP是否已经被封禁
    const [existing] = await pool.query(
      'SELECT * FROM blocked_ips WHERE ip = ?',
      [ip]
    );

    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { error: '该IP已经被封禁' },
        { status: 400 }
      );
    }

    // 添加新的封禁IP
    await pool.execute(
      'INSERT INTO blocked_ips (ip, reason, created_at) VALUES (?, ?, NOW())',
      [ip, reason]
    );

    return NextResponse.json({ message: 'IP封禁成功' });
  } catch (error) {
    console.error('封禁IP失败:', error);
    return NextResponse.json(
      { error: '封禁IP失败' },
      { status: 500 }
    );
  }
}

// 解除IP封禁
export async function DELETE(request: Request) {
  try {
    const { ip } = await request.json();

    await pool.execute(
      'DELETE FROM blocked_ips WHERE ip = ?',
      [ip]
    );

    return NextResponse.json({ message: 'IP解封成功' });
  } catch (error) {
    console.error('解封IP失败:', error);
    return NextResponse.json(
      { error: '解封IP失败' },
      { status: 500 }
    );
  }
} 