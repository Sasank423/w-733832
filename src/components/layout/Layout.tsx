
import { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type LayoutProps = {
  children: ReactNode;
  fullWidth?: boolean;
};

const Layout = ({ children, fullWidth = false }: LayoutProps) => {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={toggleNavbar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <Navbar isCollapsed={isNavbarCollapsed} toggleCollapse={toggleNavbar} />
      <main className={`flex-grow transition-all duration-300 ${isNavbarCollapsed ? 'md:ml-16' : 'md:ml-0'} ${fullWidth ? '' : 'container-layout'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
