import React, { useState, useEffect, useCallback } from 'react';
import { Task, ViewRoute } from './types';
import { 
  loadTasks, 
  saveTasks, 
  resetToSampleTasks, 
  markTaskAsDone, 
  markTaskAsPending,
  isTaskDoneThisPeriod 
} from './utils/storage';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TasksListView } from './components/TasksListView';
import { TaskDetailView } from './components/TaskDetailView';
import { NewTaskView } from './components/NewTaskView';
import { MarkDoneModal } from './components/MarkDoneModal';
import { EditTaskModal } from './components/EditTaskModal';
import { CheckCircle2, AlertTriangle, X, LayoutDashboard, ListTodo, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedTaskForDone, setSelectedTaskForDone] = useState<Task | null>(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // Route state supporting / , /tasks , /tasks/new , /tasks/:id
  const getInitialRoute = (): ViewRoute => {
    try {
      const path = window.location.pathname;
      const hash = window.location.hash.replace(/^#/, '');
      const activePath = hash || path;

      if (activePath === '/tasks/new' || activePath.startsWith('/tasks/new')) {
        return { name: 'task-new' };
      }
      if (activePath.startsWith('/tasks/')) {
        const id = activePath.split('/tasks/')[1]?.split('?')[0]?.split('/')[0];
        if (id) {
          return { name: 'task-detail', taskId: id };
        }
      }
      if (activePath === '/tasks' || activePath.startsWith('/tasks')) {
        return { name: 'tasks' };
      }
      return { name: 'dashboard' };
    } catch {
      return { name: 'dashboard' };
    }
  };

  const [currentRoute, setCurrentRoute] = useState<ViewRoute>(getInitialRoute);

  // Sync browser URL with routing
  const navigateTo = useCallback((newRoute: ViewRoute) => {
    setCurrentRoute(newRoute);
    let targetUrl = '/';
    if (newRoute.name === 'tasks') {
      targetUrl = '/tasks';
    } else if (newRoute.name === 'task-new') {
      targetUrl = '/tasks/new';
    } else if (newRoute.name === 'task-detail') {
      targetUrl = `/tasks/${newRoute.taskId}`;
    }

    try {
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ route: newRoute }, '', targetUrl);
      }
    } catch {
      // Fallback for sandboxed iframes where pushState may be restricted
      window.location.hash = targetUrl;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Handlers for Tasks
  const handleConfirmMarkDone = (taskId: string, completedBy: string, notes?: string) => {
    const { updatedTasks, updatedTask } = markTaskAsDone(tasks, taskId, completedBy, notes);
    setTasks(updatedTasks);
    if (updatedTask) {
      showToast(`Logged completion for "${updatedTask.title}"!`);
    }
  };

  const handleMarkPending = (taskId: string) => {
    const updated = markTaskAsPending(tasks, taskId);
    setTasks(updated);
    showToast('Task status reset to pending.', 'info');
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'history'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      history: [],
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    showToast(`Created new SOP: "${newTask.title}"!`);
    navigateTo({ name: 'task-detail', taskId: newTask.id });
  };

  const handleSaveEditedTask = (updatedTask: Task) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updated);
    saveTasks(updated);
    showToast(`Updated "${updatedTask.title}".`);
  };

  const handleDeleteTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    if (window.confirm(`Are you sure you want to delete the SOP "${target.title}"?`)) {
      const updated = tasks.filter((t) => t.id !== taskId);
      setTasks(updated);
      saveTasks(updated);
      showToast(`Deleted "${target.title}".`, 'info');
      navigateTo({ name: 'tasks' });
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks and SOPs to the default 8 sample operational procedures?')) {
      const defaultTasks = resetToSampleTasks();
      setTasks(defaultTasks);
      showToast('Sample operational procedures restored.', 'info');
      navigateTo({ name: 'dashboard' });
    }
  };

  const pendingCount = tasks.filter((t) => !isTaskDoneThisPeriod(t)).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Header */}
      <Header
        currentRoute={currentRoute}
        onRouteChange={navigateTo}
        onResetData={handleResetData}
        pendingCount={pendingCount}
        totalCount={tasks.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        <AnimatePresence mode="wait">
          {currentRoute.name === 'dashboard' && (
            <motion.div
              key="route-dashboard"
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <DashboardView
                tasks={tasks}
                onRouteChange={navigateTo}
                onOpenMarkDoneModal={setSelectedTaskForDone}
              />
            </motion.div>
          )}

          {currentRoute.name === 'tasks' && (
            <motion.div
              key={`route-tasks-${currentRoute.filterStatus || 'all'}-${currentRoute.filterFrequency || 'all'}`}
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <TasksListView
                tasks={tasks}
                onRouteChange={navigateTo}
                onOpenMarkDoneModal={setSelectedTaskForDone}
                onOpenEditModal={setSelectedTaskForEdit}
                onDeleteTask={handleDeleteTask}
                onMarkPending={handleMarkPending}
                initialFilterStatus={currentRoute.filterStatus || 'all'}
                initialFilterFrequency={currentRoute.filterFrequency || 'all'}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </motion.div>
          )}

          {currentRoute.name === 'task-detail' && (
            <motion.div
              key={`route-detail-${currentRoute.taskId}`}
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              {(() => {
                const activeTask = tasks.find((t) => t.id === currentRoute.taskId);
                if (!activeTask) {
                  return (
                    <div className="text-center py-16 space-y-4">
                      <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                      <h2 className="text-lg font-semibold text-stone-200">Task or SOP not found</h2>
                      <p className="text-xs text-stone-400 max-w-sm mx-auto">
                        The requested operational task does not exist or may have been deleted.
                      </p>
                      <button
                        onClick={() => navigateTo({ name: 'tasks' })}
                        className="px-4 py-2 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-lg transition-colors inline-block"
                      >
                        Return to All Tasks
                      </button>
                    </div>
                  );
                }
                return (
                  <TaskDetailView
                    task={activeTask}
                    onRouteChange={navigateTo}
                    onOpenMarkDoneModal={setSelectedTaskForDone}
                    onOpenEditModal={setSelectedTaskForEdit}
                    onDeleteTask={handleDeleteTask}
                    onMarkPending={handleMarkPending}
                  />
                );
              })()}
            </motion.div>
          )}

          {currentRoute.name === 'task-new' && (
            <motion.div
              key="route-new"
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <NewTaskView
                onRouteChange={navigateTo}
                onAddTask={handleAddTask}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-6 text-center text-xs text-stone-400 bg-stone-900/50 mb-16 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-300">OpsCore Tracker</span>
            <span>•</span>
            <span>Internal Operational SOP Framework</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>{tasks.length} standard operating procedures</span>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="hover:text-stone-300 underline underline-offset-2 cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav" 
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-lg border-t border-stone-800 px-3 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom"
      >
        <button
          onClick={() => navigateTo({ name: 'dashboard' })}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg min-h-[44px] min-w-[64px] transition-colors cursor-pointer ${
            currentRoute.name === 'dashboard'
              ? 'text-emerald-400 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => navigateTo({ name: 'tasks' })}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg min-h-[44px] min-w-[64px] transition-colors relative cursor-pointer ${
            currentRoute.name === 'tasks'
              ? 'text-emerald-400 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <ListTodo className="w-5 h-5 mb-0.5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500 text-stone-950 font-bold">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">All Tasks</span>
        </button>

        <button
          onClick={() => navigateTo({ name: 'task-new' })}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg min-h-[44px] min-w-[64px] transition-colors cursor-pointer ${
            currentRoute.name === 'task-new'
              ? 'text-emerald-400 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Add Task</span>
        </button>
      </nav>

      {/* Mark Task as Done Modal */}
      <MarkDoneModal
        task={selectedTaskForDone}
        isOpen={Boolean(selectedTaskForDone)}
        onClose={() => setSelectedTaskForDone(null)}
        onConfirm={handleConfirmMarkDone}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        task={selectedTaskForEdit}
        isOpen={Boolean(selectedTaskForEdit)}
        onClose={() => setSelectedTaskForEdit(null)}
        onSave={handleSaveEditedTask}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            key="app-toast-alert"
            id="app-toast-alert"
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="fixed bottom-20 sm:bottom-5 right-4 left-4 sm:left-auto sm:right-5 z-50 flex items-center justify-between sm:justify-start gap-2.5 px-4 py-3 rounded-xl bg-stone-900 border border-emerald-500/40 text-stone-100 shadow-xl shadow-stone-950/80 max-w-md sm:max-w-none"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium">{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-stone-500 hover:text-stone-300 p-1 ml-2 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
