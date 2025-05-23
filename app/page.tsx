"use client";
import React from 'react';
import Button from '../components/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">欢迎使用 Next.js!</h1>
        <p className="text-lg text-gray-600">
          Tailwind CSS 配置成功！
        </p>
        <Button label="点击我" onClick={() => alert('按钮已点击！')} />
      </div>
    </div>
  );
}