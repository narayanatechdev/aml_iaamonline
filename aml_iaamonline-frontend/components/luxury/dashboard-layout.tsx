'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  Bell, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  HelpCircle,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
        active 
          ? "bg-luxury-primary text-white shadow-lg shadow-luxury-primary/20" 
          : "text-luxury-text-secondary hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-luxury-text-secondary group-hover:text-white")} />
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{label}</span>
      )}
      {!collapsed && active && (
        <motion.div 
          layoutId="sidebar-active"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
        />
      )}
    </button>
  );
};

export const LuxuryDashboardLayout = ({ children, activeTab, onTabChange }: { children: React.ReactNode, activeTab: string, onTabChange: (tab: string) => void }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-bg text-luxury-text-primary font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 bottom-0 bg-luxury-card border-r border-luxury-border z-[101] transition-all duration-500 ease-in-out",
          collapsed ? "w-20" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-2 mb-10 mt-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-luxury-primary to-luxury-secondary flex items-center justify-center shadow-lg shadow-luxury-primary/20 flex-shrink-0">
              <span className="text-lg font-bold">AL</span>
            </div>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-xl tracking-tight"
              >
                AML <span className="text-luxury-primary">Lux</span>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-1">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Insights" 
              active={activeTab === 'insights'} 
              onClick={() => onTabChange('insights')}
              collapsed={collapsed}
            />
            <SidebarItem 
              icon={FileText} 
              label="Manuscripts" 
              active={activeTab === 'manuscripts'} 
              onClick={() => onTabChange('manuscripts')}
              collapsed={collapsed}
            />
            <SidebarItem 
              icon={Users} 
              label="Team" 
              active={activeTab === 'users'} 
              onClick={() => onTabChange('users')}
              collapsed={collapsed}
            />
            <SidebarItem 
              icon={Settings} 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => onTabChange('settings')}
              collapsed={collapsed}
            />
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 mt-auto pt-4 border-t border-luxury-border">
            <SidebarItem icon={HelpCircle} label="Support" collapsed={collapsed} />
            <SidebarItem icon={LogOut} label="Log out" collapsed={collapsed} />
            
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center w-full py-2 mt-4 text-luxury-text-secondary hover:text-white transition-colors"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wall */}
      <main className={cn(
        "transition-all duration-500 ease-in-out min-h-screen",
        collapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 h-20 bg-luxury-bg/80 backdrop-blur-xl border-b border-luxury-border flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-luxury-text-secondary hover:text-white lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-text-secondary" />
              <input 
                type="text" 
                placeholder="Search analytics..."
                className="bg-luxury-card border border-luxury-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-luxury-primary/40 focus:border-luxury-primary transition-all text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-luxury-text-secondary hover:text-white hover:bg-white/5 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-luxury-primary rounded-full ring-2 ring-luxury-bg" />
            </Button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-luxury-border h-8">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">Alex Rivera</p>
                <p className="text-[10px] text-luxury-text-secondary font-bold uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-luxury-primary to-luxury-blue-500 ring-2 ring-luxury-border cursor-pointer hover:ring-luxury-primary/50 transition-all shadow-lg" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
