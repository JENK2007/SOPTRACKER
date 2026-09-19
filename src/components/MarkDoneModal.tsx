import React, { useState } from 'react';
import { Task } from '../types';
import { CheckCircle2, X, Clock, User, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MarkDoneModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string, completedBy: string, notes?: string) => void;
}

export const MarkDoneModal: React.FC<MarkDoneModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [completedBy, setCompletedBy] = useState(task?.owner || 'Operator');
  const [notes, setNotes] = useState('');

  // Keep completedBy synced if task changes
  React.useEffect(() => {
    if (task) {
      setCompletedBy(task.owner || 'Operator');
      setNotes('');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(task.id, completedBy, notes);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
        />

        {/* Dialog Panel */}
        <motion.div 
          id="mark-done-modal-dialog"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", damping: 26, stiffness: 360 }}
          className="relative z-10 w-full max-w-md bg-stone-900 border border-stone-800 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-stone-100">Mark Task as Completed</h3>
            </div>
            <button
              id="mark-done-modal-close"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
            <div className="bg-stone-800/60 p-3 rounded-lg border border-stone-700/60">
              <p className="text-xs text-stone-400 font-medium mb-1">Operational Task:</p>
              <h4 className="text-sm font-semibold text-stone-100 leading-snug">{task.title}</h4>
              <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{task.frequency} Routine</span>
                </span>
                <span>•</span>
                <span>{task.steps.length} SOP Steps</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                Completed By
              </label>
              <input
                id="mark-done-operator-input"
                type="text"
                required
                value={completedBy}
                onChange={(e) => setCompletedBy(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[38px]"
                placeholder="e.g. Sarah Chen, Ops Team"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-400" />
                Execution Notes / Verification Log (Optional)
              </label>
              <textarea
                id="mark-done-notes-input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg p-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[80px]"
                placeholder="e.g. Verified Stripe MRR, posted summary to leadership Slack channel. All green."
              />
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-2.5">
              <button
                type="button"
                id="mark-done-cancel-btn"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer min-h-[38px] flex items-center justify-center"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                id="mark-done-confirm-btn"
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-900/30 cursor-pointer min-h-[40px] sm:min-h-[38px]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Completion</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
