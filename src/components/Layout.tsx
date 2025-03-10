
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  PieChart, 
  ServerCog, 
  FileText, 
  Settings,
  MenuIcon,
  XIcon,
  Globe
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Close menu on route change or if screen size changes from mobile to desktop
  useEffect(() => {
    setMenuOpen(false);
  }, [location, isMobile]);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard, 
      active: location.pathname === '/' 
    },
    { 
      name: 'Applications', 
      href: '/applications', 
      icon: FileText, 
      active: location.pathname.startsWith('/applications') 
    },
    { 
      name: 'API Connections', 
      href: '/connections', 
      icon: ServerCog, 
      active: location.pathname.startsWith('/connections') 
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: PieChart, 
      active: location.pathname.startsWith('/analytics') 
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings, 
      active: location.pathname.startsWith('/settings') 
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="font-semibold tracking-tight text-lg">Assurance Hub</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Additional header elements can go here */}
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex">
        {/* Sidebar navigation for desktop */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out pt-16 border-r bg-background",
            isMobile ? 
              (menuOpen ? "translate-x-0" : "-translate-x-full") : 
              "translate-x-0"
          )}
        >
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  item.active ? 
                    "bg-primary/10 text-primary" : 
                    "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Overlay to close menu on mobile when clicked outside */}
        {isMobile && menuOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isMobile ? "pl-0" : "pl-64"
        )}>
          <div className="container px-4 py-6 md:px-6 lg:px-8 mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
