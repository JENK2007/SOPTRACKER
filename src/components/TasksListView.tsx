import React, { useState, useMemo } from 'react';
import { Task, TaskFrequency, ViewRoute } from '../types';
import { 
  isTaskDoneThisPeriod, 
  formatDateRelative, 
  getFrequencyBadge, 
  formatDateFull 
} from '../utils/storage';
import { 
  Search, 
  Filter, 
  LayoutList, 
  LayoutGrid, 
  CheckCircle2, 
  Clock, 
  User, 
  ArrowRight, 
  BookOpen, 
  PlusCircle, 
  ExternalLink,
  ChevronRight,
  Trash2,
  Edit,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TasksListViewProps {
  tasks: Task[];
  onRouteChange: (route: ViewRoute) => void;
  onOpenMarkDoneModal: (task: Task) => void;
  onOpenEditModal: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMarkPending: (taskId: string) => void;
  initialFilterStatus?: 'all' | 'pending' | 'done';
  initialFilterFrequency?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TasksListView: React.FC<TasksListViewProps> = ({
  tasks,
  onRouteChange,
  onOpenMarkDoneModal,
  onOpenEditModal,
  onDeleteTask,
  onMarkPending,
  initialFilterStatus = 'all',
  initialFilterFrequency = 'all',
  searchQuery,
  onSearchChange,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done'>(initialFilterStatus);
  const [frequencyFilter, setFrequencyFilter] = useState<string>(initialFilterFrequency);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const isDone = isTaskDoneThisPeriod(t);
      
      // Status filter
      if (statusFilter === 'pending' && isDone) return false;
      if (statusFilter === 'done' && !isDone) return false;

      // Frequency filter
      if (frequencyFilter !== 'all' && t.frequency !== frequencyFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

      // Search query (matches title, owner, category, steps)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = t.title.toLowerCase().includes(q);
        const inOwner = t.owner.toLowerCase().includes(q) || (t.ownerRole?.toLowerCase().includes(q) ?? false);
        const inCategory = t.category.toLowerCase().includes(q);
        const inSteps = t.steps.some((s) => s.toLowerCase().includes(q));
        if (!inTitle && !inOwner && !inCategory && !inSteps) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, frequencyFilter, categoryFilter, searchQuery]);

  const pendingCount = tasks.filter((t) => !isTaskDoneThisPeriod(t)).length;
  const doneCount = tasks.filter((t) => isTaskDoneThisPeriod(t)).length;

  return (
    <div id="tasks-page-container" className="space-y-6 pb-12">
      
      {/* Page Title & Stats Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
              Operational Tasks &amp; SOPs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 border border-stone-700">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Standard operating procedures directory for recurring cadence and team handoffs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            id="tasks-add-new-btn"
            onClick={() => onRouteChange({ name: 'task-new' })}
            className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer min-h-[42px] sm:min-h-[38px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {/* Filter & View Mode Controls Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5 sm:p-4 space-y-3.5 shadow-xs">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              id="tasks-search-input"
              type="text"
              placeholder="Search by title, owner, category, or SOP text..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg pl-9 pr-8 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[38px]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* View mode toggle (Table vs Cards) */}
          <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
            <span className="text-xs text-stone-500">View:</span>
            <div className="inline-flex rounded-lg bg-stone-800 p-0.5 border border-stone-700">
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer min-h-[34px] ${
                  viewMode === 'table'
                    ? 'bg-stone-700 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                id="btn-view-cards"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer min-h-[34px] ${
                  viewMode === 'cards'
                    ? 'bg-stone-700 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills / Dropdowns */}
        <div className="space-y-3 pt-2.5 border-t border-stone-800/80">
          
          {/* Status Pills - Scrollable horizontally on small screens */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            <span className="text-[11px] font-medium text-stone-400 shrink-0 mr-1">Status:</span>
            <button
              id="filter-status-all"
              onClick={() => setStatusFilter('all')}
              className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer min-h-[32px] ${
                statusFilter === 'all'
                  ? 'bg-stone-700 text-stone-100 border border-stone-600'
                  : 'text-stone-400 hover:bg-stone-800'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              id="filter-status-pending"
              onClick={() => setStatusFilter('pending')}
              className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer min-h-[32px] ${
                statusFilter === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-stone-400 hover:bg-stone-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Pending ({pendingCount})
            </button>
            <button
              id="filter-status-done"
              onClick={() => setStatusFilter('done')}
              className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer min-h-[32px] ${
                statusFilter === 'done'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-stone-400 hover:bg-stone-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Done this period ({doneCount})
            </button>
          </div>

          {/* Dropdown filters and clear button */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              {/* Frequency dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-[10px] sm:text-[11px] font-medium text-stone-400 sm:hidden">Frequency:</span>
                <select
                  id="filter-frequency-select"
                  value={frequencyFilter}
                  onChange={(e) => setFrequencyFilter(e.target.value)}
                  className="w-full sm:w-auto bg-stone-800 border border-stone-700 rounded-md px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[34px]"
                >
                  <option value="all">All Frequencies</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="One-off">One-off</option>
                </select>
              </div>

              {/* Department / Category dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-[10px] sm:text-[11px] font-medium text-stone-400 sm:hidden">Category:</span>
                <select
                  id="filter-category-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto bg-stone-800 border border-stone-700 rounded-md px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[34px]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear filters if active */}
            {(statusFilter !== 'all' || frequencyFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
              <button
                id="filter-clear-all-btn"
                onClick={() => {
                  setStatusFilter('all');
                  setFrequencyFilter('all');
                  setCategoryFilter('all');
                  onSearchChange('');
                }}
                className="text-xs text-stone-400 hover:text-stone-200 underline underline-offset-2 ml-auto cursor-pointer py-1"
              >
                Clear all filters
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {filteredTasks.length === 0 ? (
          <motion.div 
            key="empty-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-stone-900 border border-stone-800 rounded-xl p-12 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-stone-200">No matching operational tasks found</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, status filters, or frequency settings to view other tasks.
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setStatusFilter('all');
                setFrequencyFilter('all');
                setCategoryFilter('all');
                onSearchChange('');
              }}
              className="mt-4 px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </motion.button>
          </motion.div>
        ) : viewMode === 'table' ? (
          
          /* TABLE VIEW */
          <motion.div 
            key="table-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xs"
          >
            <div className="md:hidden px-3.5 py-1.5 bg-stone-800/50 text-[11px] text-stone-400 border-b border-stone-800 flex items-center justify-between">
              <span>Swipe horizontally to view all columns</span>
              <span>→</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[680px]">
                <thead className="bg-stone-800/80 text-stone-400 font-semibold uppercase tracking-wider border-b border-stone-800 text-[10px]">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 sm:px-6">Task &amp; SOP Document</th>
                    <th scope="col" className="py-3.5 px-4">Frequency</th>
                    <th scope="col" className="py-3.5 px-4">Owner</th>
                    <th scope="col" className="py-3.5 px-4">Last Completed</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredTasks.map((task) => {
                  const isDone = isTaskDoneThisPeriod(task);
                  const freq = getFrequencyBadge(task.frequency);

                  return (
                    <tr 
                      key={task.id}
                      id={`task-table-row-${task.id}`}
                      className="hover:bg-stone-800/40 transition-colors group"
                    >
                      {/* Title & SOP info */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex flex-col">
                          <button
                            onClick={() => onRouteChange({ name: 'task-detail', taskId: task.id })}
                            className="font-semibold text-sm text-stone-100 hover:text-emerald-400 text-left transition-colors flex items-center gap-1.5 group-hover:translate-x-0.5 transform duration-150"
                          >
                            <span>{task.title}</span>
                          </button>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700/60">
                              {task.category}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              {task.steps.length} SOP steps
                            </span>
                            {task.links && task.links.length > 0 && (
                              <span className="text-[11px] text-stone-500">
                                • {task.links.length} resource links
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Frequency */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${freq.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${freq.dot}`}></span>
                          {freq.label}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] font-bold text-stone-300">
                            {task.owner.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-stone-200 text-xs">{task.owner}</p>
                            {task.ownerRole && (
                              <p className="text-[10px] text-stone-500">{task.ownerRole}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Last Completed */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-stone-300">
                          <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                          <span title={formatDateFull(task.lastCompletedAt)}>
                            {formatDateRelative(task.lastCompletedAt)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Done this period
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`row-view-sop-${task.id}`}
                            onClick={() => onRouteChange({ name: 'task-detail', taskId: task.id })}
                            className="px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-md transition-colors flex items-center gap-1 border border-stone-700/60"
                            title="View full standard operating procedure"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                            <span>SOP</span>
                          </button>

                          {isDone ? (
                            <button
                              id={`row-mark-pending-${task.id}`}
                              onClick={() => onMarkPending(task.id)}
                              className="px-2.5 py-1.5 text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-md transition-colors"
                              title="Reset status to pending"
                            >
                              Reset
                            </button>
                          ) : (
                            <button
                              id={`row-mark-done-${task.id}`}
                              onClick={() => onOpenMarkDoneModal(task)}
                              className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Done</span>
                            </button>
                          )}

                          <button
                            id={`row-edit-task-${task.id}`}
                            onClick={() => onOpenEditModal(task)}
                            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-md transition-colors"
                            title="Edit task metadata"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            id={`row-delete-task-${task.id}`}
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

      ) : (

        /* CARDS GRID VIEW */
        <motion.div 
          key="cards-view"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {filteredTasks.map((task) => {
            const isDone = isTaskDoneThisPeriod(task);
            const freq = getFrequencyBadge(task.frequency);

            return (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                id={`task-card-grid-${task.id}`}
                className="bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-colors shadow-xs group"
              >
                <div className="space-y-3">
                  {/* Frequency & Status Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${freq.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${freq.dot}`}></span>
                      {freq.label}
                    </span>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <button
                    onClick={() => onRouteChange({ name: 'task-detail', taskId: task.id })}
                    className="text-left font-semibold text-stone-100 hover:text-emerald-400 text-sm leading-snug transition-colors block cursor-pointer"
                  >
                    {task.title}
                  </button>

                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      {task.category}
                    </span>
                    <span>•</span>
                    <span>{task.steps.length} SOP steps</span>
                  </div>

                  {/* SOP step preview */}
                  <div className="bg-stone-800/50 rounded-lg p-2.5 border border-stone-700/40 text-xs text-stone-400 space-y-1">
                    <p className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                      Initial Step:
                    </p>
                    <p className="line-clamp-2 text-stone-300 text-[11px]">
                      1. {task.steps[0] || 'No steps outlined.'}
                    </p>
                  </div>

                  {/* Owner & Last Completed info */}
                  <div className="pt-2 border-t border-stone-800 space-y-1.5 text-xs text-stone-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-stone-300">
                        <User className="w-3.5 h-3.5 text-stone-500" />
                        <span>{task.owner}</span>
                      </span>
                      {task.estDurationMinutes && (
                        <span className="text-[10px] text-stone-500">
                          ~{task.estDurationMinutes} mins
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>Last: {formatDateRelative(task.lastCompletedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onRouteChange({ name: 'task-detail', taskId: task.id })}
                    className="flex-1 py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-stone-700 cursor-pointer min-h-[38px]"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                    <span>View SOP</span>
                  </button>

                  {isDone ? (
                    <button
                      onClick={() => onMarkPending(task.id)}
                      className="py-2 px-3 text-xs font-medium text-stone-400 hover:text-stone-200 bg-stone-800/80 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer min-h-[38px]"
                      title="Reset to pending"
                    >
                      Reset
                    </button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onOpenMarkDoneModal(task)}
                      className="flex-1 py-2 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[38px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Done</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
      </AnimatePresence>

    </div>
  );
};
