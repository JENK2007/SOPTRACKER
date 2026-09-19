import React, { useState } from 'react';
import { Task, ViewRoute } from '../types';
import { 
  isTaskDoneThisPeriod, 
  formatDateRelative, 
  formatDateFull, 
  getFrequencyBadge 
} from '../utils/storage';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Clock, 
  User, 
  ExternalLink, 
  Calendar, 
  FileText, 
  RotateCcw, 
  Edit, 
  Trash2, 
  AlertCircle,
  Share2,
  Check,
  Plus,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';

interface TaskDetailViewProps {
  task: Task;
  onRouteChange: (route: ViewRoute) => void;
  onOpenMarkDoneModal: (task: Task) => void;
  onOpenEditModal: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMarkPending: (taskId: string) => void;
}

export const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  task,
  onRouteChange,
  onOpenMarkDoneModal,
  onOpenEditModal,
  onDeleteTask,
  onMarkPending,
}) => {
  // In-session checklist progress state (interactive execution walkthrough)
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [copiedUrl, setCopiedUrl] = useState(false);

  const isDone = isTaskDoneThisPeriod(task);
  const freq = getFrequencyBadge(task.frequency);

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedStepsCount = Object.values(checkedSteps).filter(Boolean).length;
  const totalSteps = task.steps.length;
  const isAllStepsChecked = totalSteps > 0 && completedStepsCount === totalSteps;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleResetChecklist = () => {
    setCheckedSteps({});
  };

  return (
    <div id={`task-detail-container-${task.id}`} className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <button
            onClick={() => onRouteChange({ name: 'tasks' })}
            className="hover:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tasks</span>
          </button>
          <span>/</span>
          <span className="text-stone-300 font-medium truncate max-w-[200px] sm:max-w-xs">{task.title}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-stone-100 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
            title="Copy shareable link"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={() => onOpenEditModal(task)}
            className="px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-stone-100 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit SOP</span>
          </button>

          <button
            onClick={() => onDeleteTask(task.id)}
            className="p-2 text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Delete this task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Header Box */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-7 md:p-8 space-y-5 sm:space-y-6 shadow-xs">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 md:gap-6">
          <div className="space-y-3 flex-1">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${freq.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${freq.dot}`}></span>
                {freq.label} Routine
              </span>

              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
                {task.category}
              </span>

              {isDone ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Done this period
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Pending Execution
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-100 tracking-tight leading-tight">
              {task.title}
            </h1>

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-stone-400 pt-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] font-bold text-stone-300">
                  {task.owner.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-stone-300 font-medium">Owner: {task.owner}</span>
                {task.ownerRole && <span className="text-stone-500">({task.ownerRole})</span>}
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>Last completed: {formatDateRelative(task.lastCompletedAt)}</span>
              </div>

              {task.estDurationMinutes && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Est. Time: ~{task.estDurationMinutes} mins</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary "Mark as Done" CTA button */}
          <div className="flex flex-col sm:items-end gap-2.5 shrink-0 pt-2 md:pt-0 w-full sm:w-auto">
            {isDone ? (
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  id="detail-mark-done-btn"
                  onClick={() => onOpenMarkDoneModal(task)}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px]"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-400" />
                  <span>Log New Completion</span>
                </motion.button>
                <button
                  onClick={() => onMarkPending(task.id)}
                  className="text-[11px] text-stone-400 hover:text-stone-200 underline underline-offset-2 cursor-pointer self-center sm:self-end py-1"
                >
                  Reset status to pending
                </button>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                id="detail-mark-done-btn"
                onClick={() => onOpenMarkDoneModal(task)}
                className="w-full sm:w-auto justify-center px-6 py-3 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-950/40 transition-all flex items-center gap-2 group cursor-pointer min-h-[44px]"
              >
                <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Mark Task as Done</span>
              </motion.button>
            )}

            <span className="text-[11px] text-stone-400 font-mono text-center sm:text-right">
              Cycle: {task.frequency}
            </span>
          </div>
        </div>

      </div>

      {/* Main Detail Grid: SOP Steps Walkthrough & Resources/History Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Full SOP Steps */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-7 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 mb-5 sm:mb-6 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm sm:text-base font-bold text-stone-100">
                    Standard Operating Procedure (SOP)
                  </h2>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Follow each numbered procedure in sequence. You can check off items as you execute them.
                </p>
              </div>

              {/* Progress & Reset */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                <span className="text-xs font-semibold text-emerald-400">
                  {completedStepsCount} of {totalSteps} checked
                </span>
                {completedStepsCount > 0 && (
                  <button
                    onClick={handleResetChecklist}
                    className="text-[11px] text-stone-400 hover:text-stone-200 cursor-pointer underline underline-offset-2 sm:no-underline"
                  >
                    Reset checklist
                  </button>
                )}
              </div>
            </div>

            {/* Checklist progress bar */}
            <div className="w-full bg-stone-800 rounded-full h-1.5 mb-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: totalSteps > 0 ? `${(completedStepsCount / totalSteps) * 100}%` : '0%',
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-emerald-500 h-1.5 rounded-full"
              />
            </div>

            {/* Numbered Step List */}
            {task.steps.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No SOP steps recorded for this task.</p>
            ) : (
              <div className="space-y-3.5">
                {task.steps.map((step, idx) => {
                  const isChecked = Boolean(checkedSteps[idx]);

                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 2, transition: { duration: 0.12 } }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => toggleStep(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                        isChecked
                          ? 'bg-emerald-950/15 border-emerald-500/30 text-stone-300'
                          : 'bg-stone-800/40 border-stone-700/60 hover:border-stone-600 text-stone-200'
                      }`}
                    >
                      {/* Step Number & Checkbox */}
                      <div className="pt-0.5 shrink-0">
                        {isChecked ? (
                          <div className="w-6 h-6 rounded-md bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-xs">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-stone-800 border border-stone-600 text-stone-400 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      {/* Step Text */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Step {idx + 1}
                          </span>
                          {isChecked && (
                            <span className="text-[10px] text-emerald-400 font-medium">Done</span>
                          )}
                        </div>
                        <p className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'line-through text-stone-400' : 'text-stone-100'}`}>
                          {step}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Finish execution prompt */}
            {isAllStepsChecked && !isDone && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
              >
                <div>
                  <h4 className="text-xs font-semibold text-emerald-300">All steps completed!</h4>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    Ready to log this operational run and update the last completed timestamp?
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenMarkDoneModal(task)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer min-h-[38px] flex items-center justify-center"
                >
                  Log Completion
                </motion.button>
              </motion.div>
            )}

          </div>

        </div>

        {/* Right 1 Column: Resources/Links & Execution History Log */}
        <div className="space-y-6">
          
          {/* Resource Links Box */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              <span>Reference Links &amp; Tools</span>
            </h3>

            {(!task.links || task.links.length === 0) ? (
              <p className="text-xs text-stone-500 italic">No external resource links attached.</p>
            ) : (
              <div className="space-y-2">
                {task.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 hover:border-stone-600 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-6 h-6 rounded bg-stone-700 flex items-center justify-center text-stone-300 shrink-0 text-xs">
                        {link.title.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-stone-200 group-hover:text-emerald-400 truncate">
                        {link.title}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-300 shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Execution History & Audit Log */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completion History</span>
            </h3>

            {(!task.history || task.history.length === 0) ? (
              <div className="text-center py-6">
                <p className="text-xs text-stone-500 italic">No previous executions recorded yet.</p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Click 'Mark Task as Done' above to record the first completion.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-stone-800">
                {task.history.map((record) => (
                  <div key={record.id} className="relative pl-7 text-xs space-y-1">
                    <span className="absolute left-2 top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-stone-900"></span>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-200">
                        {record.completedBy}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {formatDateRelative(record.completedAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-400">
                      {formatDateFull(record.completedAt)}
                    </p>

                    {record.notes && (
                      <p className="text-[11px] text-stone-300 bg-stone-800/70 p-2 rounded-md border border-stone-700/50 mt-1 italic">
                        "{record.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
