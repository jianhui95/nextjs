import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { MD5 } from 'crypto-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // 这里添加你的用户注册逻辑
    const [rows] = await pool.query('SELECT * FROM users where username = ? || email = ?', [username, email]);
    if (rows && (rows as any[]).length > 0) {
      const existingUser = (rows as any[])[0];
      if (existingUser.username === username) {
        console.log('用户名已被注册');
        return NextResponse.json({ error: '用户名已被注册' }, { status: 400 });
      }
      if (existingUser.email === email) {
        console.log('邮箱已被注册');
        return NextResponse.json({ error: '邮箱已被注册' }, { status: 400 }); 
      }
    }

    // MD5 加密密码
    const hashedPassword = MD5(password).toString();

    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    console.log('✅ 用户数据已保存');
    return NextResponse.json({ message: '注册成功' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    );
  }
} 