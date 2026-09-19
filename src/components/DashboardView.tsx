import React from 'react';
import { Task, ViewRoute } from '../types';
import { 
  isTaskDoneThisPeriod, 
  formatDateRelative, 
  getFrequencyBadge, 
  formatDateFull 
} from '../utils/storage';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  BookOpen, 
  Sparkles, 
  User, 
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  tasks: Task[];
  onRouteChange: (route: ViewRoute) => void;
  onOpenMarkDoneModal: (task: Task) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  onRouteChange,
  onOpenMarkDoneModal,
}) => {
  // Calculations
  const pendingTasks = tasks.filter((t) => !isTaskDoneThisPeriod(t));
  const completedTasks = tasks.filter((t) => isTaskDoneThisPeriod(t));
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Breakdown by frequency
  const frequencyStats = {
    Daily: {
      total: tasks.filter((t) => t.frequency === 'Daily').length,
      done: tasks.filter((t) => t.frequency === 'Daily' && isTaskDoneThisPeriod(t)).length,
    },
    Weekly: {
      total: tasks.filter((t) => t.frequency === 'Weekly').length,
      done: tasks.filter((t) => t.frequency === 'Weekly' && isTaskDoneThisPeriod(t)).length,
    },
    Monthly: {
      total: tasks.filter((t) => t.frequency === 'Monthly').length,
      done: tasks.filter((t) => t.frequency === 'Monthly' && isTaskDoneThisPeriod(t)).length,
    },
    'One-off': {
      total: tasks.filter((t) => t.frequency === 'One-off').length,
      done: tasks.filter((t) => t.frequency === 'One-off' && isTaskDoneThisPeriod(t)).length,
    },
  };

  // Recent completion activity across all tasks
  const allHistory = tasks
    .flatMap((t) =>
      (t.history || []).map((h) => ({
        ...h,
        taskTitle: t.title,
        taskId: t.id,
        frequency: t.frequency,
      }))
    )
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 6);

  return (
    <div id="dashboard-view-container" className="space-y-8 pb-12">
      
      {/* Top Welcome / Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Operational SOP Command Center
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-100 tracking-tight">
            Team Operational Status
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
            Track daily, weekly, and monthly operational standard procedures, maintain execution rigor, and audit team handoffs.
          </p>
        </div>

        {/* Quick actions buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto shrink-0 pt-1 md:pt-0">
          <motion.button
            whileTap={{ scale: 0.96 }}
            id="dash-view-all-tasks-btn"
            onClick={() => onRouteChange({ name: 'tasks' })}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 sm:py-2 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[42px] sm:min-h-[38px]"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            id="dash-add-new-task-btn"
            onClick={() => onRouteChange({ name: 'task-new' })}
            className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] sm:min-h-[38px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Task</span>
          </motion.button>
        </div>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pending Tasks */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          id="stat-card-pending"
          onClick={() => onRouteChange({ name: 'tasks', filterStatus: 'pending' })}
          className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-xl p-5 transition-colors cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-medium text-stone-400">Pending This Period</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-amber-400 font-medium">tasks require run</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1 group-hover:text-stone-300">
            <span>Filter pending routines</span>
            <ChevronRight className="w-3 h-3 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          id="stat-card-completed"
          onClick={() => onRouteChange({ name: 'tasks', filterStatus: 'done' })}
          className="bg-stone-900 border border-stone-800 hover:border-emerald-500/40 rounded-xl p-5 transition-colors cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-medium text-stone-400">Completed This Period</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
              {completedTasks.length}
            </span>
            <span className="text-xs text-stone-400 font-medium">of {totalTasks} routines</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1 group-hover:text-stone-300">
            <span>View completed checklist</span>
            <ChevronRight className="w-3 h-3 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </motion.div>

        {/* Total Active SOPs */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          id="stat-card-total-sops"
          onClick={() => onRouteChange({ name: 'tasks' })}
          className="bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl p-5 transition-colors cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-medium text-stone-400">Active SOP Documents</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
              {totalTasks}
            </span>
            <span className="text-xs text-stone-400 font-medium">standard procedures</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1 group-hover:text-stone-300">
            <span>Explore repository</span>
            <ChevronRight className="w-3 h-3 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </motion.div>

        {/* Operational Completion Rate */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          id="stat-card-completion-rate" 
          className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs"
        >
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-medium text-stone-400">Compliance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
              {completionRate}%
            </span>
            <span className="text-xs text-stone-400 font-medium">on-track</span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="bg-emerald-500 h-1.5 rounded-full" 
            />
          </div>
        </motion.div>

      </div>

      {/* Main Grid: Pending Action Items & Activity / Frequency Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Priority Operational Tasks (Pending) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-stone-100 uppercase tracking-wider">
                Action Required ({pendingTasks.length} Pending)
              </h2>
            </div>
            <button
              id="dash-see-all-pending-btn"
              onClick={() => onRouteChange({ name: 'tasks', filterStatus: 'pending' })}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>See full list</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-stone-200">All routines are up to date!</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                No tasks are currently pending for their designated cycle. Good work keeping operations tight.
              </p>
              <button
                onClick={() => onRouteChange({ name: 'tasks' })}
                className="mt-4 px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>Browse All SOPs</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task, idx) => {
                const freq = getFrequencyBadge(task.frequency);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    whileHover={{ x: 2, transition: { duration: 0.15 } }}
                    id={`pending-task-card-${task.id}`}
                    className="bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl p-4 sm:p-5 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${freq.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${freq.dot}`}></span>
                          {freq.label}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
                          {task.category}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {task.steps.length} SOP steps
                        </span>
                      </div>

                      <button
                        onClick={() => onRouteChange({ name: 'task-detail', taskId: task.id })}
                        className="text-left font-semibold text-sm sm:text-base text-stone-100 hover:text-emerald-400 transition-colors block cursor-pointer"
                      >
                        {task.title}
                      </button>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-stone-500" />
                          <span>{task.owner}</span>
                          {task.ownerRole && (
                            <span className="text-stone-500">({task.ownerRole})</span>
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-500" />
                          <span>Last completed: {formatDateRelative(task.lastCompletedAt)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/80 w-full sm:w-auto">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        id={`btn-open-sop-${task.id}`}
                        onClick={() => onRouteChange({ name: 'task-detail', taskId: task.id })}
                        className="flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 text-xs font-medium text-stone-300 hover:text-stone-100 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] sm:min-h-[36px]"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                        <span>View SOP</span>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        id={`btn-mark-done-quick-${task.id}`}
                        onClick={() => onOpenMarkDoneModal(task)}
                        className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[40px] sm:min-h-[36px]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Column: Frequency Breakdown & Recent Activity */}
        <div className="space-y-6">
          
          {/* Frequency Breakdown Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-stone-400" />
              <span>Routine Cadence Breakdown</span>
            </h3>

            <div className="space-y-3.5">
              {(['Daily', 'Weekly', 'Monthly', 'One-off'] as const).map((freqKey) => {
                const stat = frequencyStats[freqKey];
                const pct = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;
                const badge = getFrequencyBadge(freqKey);

                return (
                  <div key={freqKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-300 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                        {freqKey} Tasks
                      </span>
                      <span className="text-stone-400 font-mono text-[11px]">
                        {stat.done} / {stat.total} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="h-1.5 rounded-full bg-emerald-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">Total operational tasks</span>
              <span className="text-xs font-bold text-stone-200">{totalTasks} SOPs</span>
            </div>
          </div>

          {/* Recent Audit / Completion Feed */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Recent Execution History</span>
            </h3>

            {allHistory.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No execution history recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {allHistory.map((item, idx) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className="text-xs pb-3 border-b border-stone-800/80 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => onRouteChange({ name: 'task-detail', taskId: item.taskId })}
                        className="font-medium text-stone-200 hover:text-emerald-400 text-left line-clamp-1 transition-colors cursor-pointer"
                      >
                        {item.taskTitle}
                      </button>
                      <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                        {formatDateRelative(item.completedAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                      <span className="text-emerald-400 font-medium">✓ Completed by</span>
                      <span className="text-stone-300 font-medium">{item.completedBy}</span>
                    </p>
                    {item.notes && (
                      <p className="text-[11px] text-stone-400 mt-1 bg-stone-800/60 p-2 rounded border border-stone-700/50 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
