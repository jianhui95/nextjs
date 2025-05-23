'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface UserDetail {
  id: number;
  username: string;
  email: string;
  created_at: string;
  status: boolean;
  avatar_url?: string; // 为未来的头像功能预留
  bio?: string;        // 为未来的个人简介预留
  last_login?: string; // 为未来的最后登录时间预留
}

export default function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`/api/admin/users/${resolvedParams.id}/detail`);
        if (!response.ok) {
          throw new Error('获取用户详情失败');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取用户详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <span className="text-gray-600">加载中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600">
        {error}
      </div>
    );
  }

  if (!user) {
    return <div className="text-center">用户不存在</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 顶部导航 */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">用户详情</h2>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            返回
          </button>
        </div>

        {/* 用户基本信息 */}
        <div className="p-6">
          <div className="flex items-start space-x-6">
            {/* 左侧头像区域 */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-400">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* 右侧信息区域 */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status ? '正常' : '已封禁'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">注册时间：</span>
                    <span className="text-gray-900">{new Date(user.created_at).toLocaleString()}</span>
                  </p>
                  {user.last_login && (
                    <p className="text-sm">
                      <span className="text-gray-500">最后登录：</span>
                      <span className="text-gray-900">{new Date(user.last_login).toLocaleString()}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 个人简介 */}
              {user.bio && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500">个人简介</h4>
                  <p className="mt-2 text-sm text-gray-900">{user.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* 未来可以添加的部分 */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-4">更多信息</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">0</div>
                <div className="text-sm text-gray-500">发帖数量</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">0</div>
                <div className="text-sm text-gray-500">获赞数</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">0</div>
                <div className="text-sm text-gray-500">评论数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 