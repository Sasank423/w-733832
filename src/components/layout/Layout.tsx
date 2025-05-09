
import { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isCollapsed={false} toggleCollapse={() => {}} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
