import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Knowledge } from './pages/Knowledge';
import { Review } from './pages/Review';
import { Random } from './pages/Random';
import { Favorites } from './pages/Favorites';
import { Statistics } from './pages/Statistics';
import { Settings } from './pages/Settings';

/** 带布局的页面包装器 */
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
    </Layout>
  );
}

/** 应用路由配置 */
export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/dashboard',
      element: (
        <PageWrapper>
          <Dashboard />
        </PageWrapper>
      ),
    },
    {
      path: '/knowledge',
      element: (
        <PageWrapper>
          <Knowledge />
        </PageWrapper>
      ),
    },
    {
      path: '/review',
      element: (
        <PageWrapper>
          <Review />
        </PageWrapper>
      ),
    },
    {
      path: '/random',
      element: (
        <PageWrapper>
          <Random />
        </PageWrapper>
      ),
    },
    {
      path: '/favorites',
      element: (
        <PageWrapper>
          <Favorites />
        </PageWrapper>
      ),
    },
    {
      path: '/statistics',
      element: (
        <PageWrapper>
          <Statistics />
        </PageWrapper>
      ),
    },
    {
      path: '/settings',
      element: (
        <PageWrapper>
          <Settings />
        </PageWrapper>
      ),
    },
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />,
    },
  ],
  { basename: '/AmKnowlegdeReview' }
);
