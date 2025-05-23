import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 缓存封禁的IP列表和最后更新时间
let blockedIps: string[] = []
let lastUpdate = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// 定义路由配置
const ROUTE_CONFIG = {
  // 需要登录验证的路由
  authRequired: {
    '/': true,
    //'/profile': true,
  },
  // 需要IP验证的路由
  ipCheck: {
    '/register': true,
    //'/':true,
  },
  // 公开路由（不需要任何验证）
  public: {
    '/login': true,
    '/api': true,
    '/_next': true,
    '/favicon.ico': true,
  }
}

// 从API获取最新的封禁IP列表
async function getBlockedIps(request: NextRequest) {
  const now = Date.now()
  
  // 如果缓存还有效，直接返回缓存的数据
  if (now - lastUpdate < CACHE_DURATION) {
    return blockedIps
  }

  try {
    // 使用当前请求的URL构建API地址
    const apiUrl = new URL('/api/blocked-ips', request.url)
    
    // 通过API获取封禁IP列表
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('获取封禁IP列表失败')
    }

    const data = await response.json()
    blockedIps = data.map((item: any) => item.ip)
    lastUpdate = now
    return blockedIps
  } catch (error) {
    console.error('获取封禁IP列表失败:', error)
    return blockedIps // 如果查询失败，返回上次的缓存数据
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 检查是否是公开路由
  for (const publicPath of Object.keys(ROUTE_CONFIG.public)) {
    if (path.startsWith(publicPath)) {
      return NextResponse.next()
    }
  }

  // 1. 处理需要 IP 验证的路由
  if (ROUTE_CONFIG.ipCheck[path as keyof typeof ROUTE_CONFIG.ipCheck]) {
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown'

    if (clientIp === 'unknown' ) {
      return new NextResponse(
        JSON.stringify({ error: '无法验证您的访问权限' }), 
        { 
          status: 403,
          headers: { 'content-type': 'application/json' }
        }
      )
    }

    const blockedIps = await getBlockedIps(request)
    if (blockedIps.includes(clientIp) || clientIp === '::1') {
      return new NextResponse(
        JSON.stringify({ error: '您的IP已被封禁' }), 
        { 
          status: 403,
          headers: { 'content-type': 'application/json' }
        }
      )
    }
  }

  // 2. 处理需要管理员权限的路由
  // if (ROUTE_CONFIG.adminRequired[path as keyof typeof ROUTE_CONFIG.adminRequired]) {
  //   const session = request.cookies.get('session')
  //   const isAdmin = request.cookies.get('isAdmin')

  //   if (!session || !isAdmin) {
  //     // 如果未登录，重定向到登录页
  //     if (!session) {
  //       return NextResponse.redirect(new URL('/login', request.url))
  //     }
  //     // 如果已登录但不是管理员，重定向到首页
  //     return NextResponse.redirect(new URL('/', request.url))
  //   }
  // }

  // 3. 处理需要登录验证的路由
  if (ROUTE_CONFIG.authRequired[path as keyof typeof ROUTE_CONFIG.authRequired]) {
    const session = request.cookies.get('session')
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// 配置中间件匹配的路由（匹配所有路由，具体的过滤在中间件内部处理）
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 