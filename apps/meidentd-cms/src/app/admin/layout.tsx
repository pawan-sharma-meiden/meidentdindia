'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  ChevronRight, 
  LogOut, 
  Shield, 
  Activity,
  SlidersHorizontal
} from 'lucide-react';
import AdminFooter from '@/components/admin/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isActive = (path: string) => pathname === path;

  const NavItem = ({ href, icon: Icon, label, exact = false }: { href: string, icon: any, label: string, exact?: boolean }) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    
    return (
      <li>
        <Link 
          href={href} 
          className={`
            group relative flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden
            ${active 
              ? 'text-white bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
          `}
        >
          {active && (
            <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
          )}

          <div className="flex items-center relative z-10">
            <Icon size={18} className={`mr-3 transition-colors ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className={active ? 'font-semibold tracking-wide' : 'font-normal'}>{label}</span>
          </div>
          
          {active && (
             <motion.div layoutId="active-indicator">
                <ChevronRight size={14} className="text-blue-400" />
             </motion.div>
          )}
        </Link>
      </li>
    );
  };

  return (
    <div className="flex h-screen bg-[#0b1120] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-900/10 blur-[100px]" />
         <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-900/10 blur-[100px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 
          bg-[#0f1629]/90 backdrop-blur-xl border-r border-white/5 
          flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f1629]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield size={16} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-display font-bold text-white tracking-tight">MEIDEN<span className="text-blue-500">CMS</span></h2>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Admin Console</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 overflow-y-auto space-y-8 custom-scrollbar">
          
          <div className="space-y-2">
            <p className="px-4 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
            <ul className="space-y-1">
              <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" exact={true} />
              <NavItem href="/admin/pages" icon={FileText} label="Manage Pages" />
            </ul>
          </div>

          <div className="space-y-2">
            <p className="px-4 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">System Config</p>
            <ul className="space-y-1">
              <NavItem href="/admin/site-config" icon={SlidersHorizontal} label="Site Config" />
              <li>
                <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed opacity-50 rounded-lg border border-transparent border-dashed hover:border-slate-700 transition-colors">
                  <div className="flex items-center">
                    <Settings size={18} className="mr-3" />
                    <span>Settings</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">LOCKED</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[1px]">
                    <div className="w-full h-full rounded-full bg-[#0f1629] flex items-center justify-center text-xs font-bold text-blue-400">
                        A
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Administrator</span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                        Online
                    </span>
                </div>
            </div>
            <button className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        <header className="h-16 lg:hidden flex items-center justify-between px-4 bg-[#0f1629]/80 backdrop-blur-md border-b border-white/5">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="font-display font-bold text-white tracking-tight">MEIDEN<span className="text-blue-500">CMS</span></span>
          <div className="w-8" /> 
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full min-h-full flex flex-col">
            
            <div className="mb-8 hidden lg:flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
                    <span>SYSTEM</span>
                    <span className="text-slate-700">/</span>
                    <span className="text-blue-400 uppercase">{pathname.split('/').pop() || 'HOME'}</span>
                </div>
                <h1 className="text-3xl font-display font-bold text-white tracking-tight capitalize">
                  {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 border border-white/5 bg-white/5 px-4 py-2 rounded-full">
                <div className="flex items-center gap-2">
                    <Activity size={12} className="text-blue-400" />
                    <span>Lat: 24ms</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <span className="text-emerald-500">DB: Connected</span>
              </div>
            </div>

            <div className="flex-1 relative">
                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl opacity-50 pointer-events-none" />
                
                <div className="h-full bg-[#0f1629]/60 backdrop-blur-sm rounded-2xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col">

                   <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                   
                   <div className="p-6 md:p-8 flex-1">
                     {children}
                   </div>
                </div>
            </div>
            
            <div className="mt-8">
              <AdminFooter />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}