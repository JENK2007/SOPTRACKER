import React, { useState } from 'react';
import { ViewRoute } from '../types';
import { 
  ClipboardCheck, 
  LayoutDashboard, 
  ListTodo, 
  PlusCircle, 
  RotateCcw,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentRoute: ViewRoute;
  onRouteChange: (route: ViewRoute) => void;
  onResetData: () => void;
  pendingCount: number;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onRouteChange,
  onResetData,
  pendingCount,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const isDashboard = currentRoute.name === 'dashboard';
  const isTasks = currentRoute.name === 'tasks';
  const isNew = currentRoute.name === 'task-new';

  return (
    <header id="app-header" className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Product Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="nav-logo-btn"
              onClick={() => onRouteChange({ name: 'dashboard' })}
              className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none cursor-pointer py-1"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/25 transition-colors">
                <ClipboardCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs sm:text-sm tracking-tight text-stone-100">OpsCore</span>
                  <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SOP Hub
                  </span>
                </div>
                <p className="hidden xs:block text-[10px] sm:text-[11px] text-stone-400 font-normal">Team Task &amp; SOP Tracker</p>
              </div>
            </button>
          </div>

          {/* Quick Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xs items-center relative">
            <Search className="w-4 h-4 absolute left-3 text-stone-400 pointer-events-none" />
            <input
              id="header-quick-search-input"
              type="text"
              placeholder="Search tasks, owners, SOPs..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentRoute.name !== 'tasks') {
                  onRouteChange({ name: 'tasks' });
                }
              }}
              className="w-full bg-stone-800/80 border border-stone-700/80 rounded-lg pl-9 pr-7 py-1.5 text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 text-stone-400 hover:text-stone-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Mobile Search Toggle Button */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle search"
            >
              {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden sm:flex items-center gap-1.5 sm:gap-2">
              <button
                id="nav-dashboard-btn"
                onClick={() => onRouteChange({ name: 'dashboard' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer min-h-[38px] ${
                  isDashboard
                    ? 'bg-stone-800 text-emerald-400 border border-stone-700 shadow-xs'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                id="nav-tasks-btn"
                onClick={() => onRouteChange({ name: 'tasks' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors relative cursor-pointer min-h-[38px] ${
                  isTasks
                    ? 'bg-stone-800 text-emerald-400 border border-stone-700 shadow-xs'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>All Tasks</span>
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                id="nav-new-task-btn"
                onClick={() => onRouteChange({ name: 'task-new' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[38px] ${
                  isNew
                    ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </nav>

            {/* Reset sample data button */}
            <button
              id="nav-reset-data-btn"
              onClick={onResetData}
              title="Reset to default operational tasks"
              className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Reset sample data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Search Expandable Tray */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden pb-3 pt-1 border-t border-stone-800/60"
            >
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tasks, owners, SOPs..."
                  value={searchQuery}
                  autoFocus
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentRoute.name !== 'tasks') {
                      onRouteChange({ name: 'tasks' });
                    }
                  }}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-9 py-2 text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};

