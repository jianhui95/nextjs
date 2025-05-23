import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { MD5 } from 'crypto-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // MD5 加密密码用于比较
    const hashedPassword = MD5(password).toString();

    // 查询用户
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, hashedPassword]
    );

    if ((rows as any[]).length > 0) {
      const user = (rows as any[])[0];
      // 不返回密码
      delete user.password;
      
      // 创建响应对象
      const response = NextResponse.json({
        message: '登录成功',
        user
      }, { status: 200 });

      // 设置 session cookie
      // maxAge: 7天 = 7 * 24 * 60 * 60 秒
      response.cookies.set('session', user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60
      });

      // 如果是管理员，设置 isAdmin cookie
      if (user.role === 'admin') {
        response.cookies.set('isAdmin', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60
        });
      }

      return response;
    } else {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
} 