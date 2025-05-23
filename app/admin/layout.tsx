'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/users', label: '用户管理' },
    { href: '/admin/dashboard', label: '仪表盘' },
    { href: '/admin/settings', label: '系统设置' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="mx-auto">
          <div className="flex h-16">
            <div className="w-64 flex-shrink-0 flex items-center justify-center border-r">
              <span className="text-xl font-bold text-gray-800">后台管理系统</span>
            </div>
            <div className="flex-1 flex justify-end px-4">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* 侧边栏 */}
        <aside className="w-64 flex-shrink-0 bg-white shadow-sm h-[calc(100vh-4rem)] sticky top-16">
          <nav className="mt-5 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 