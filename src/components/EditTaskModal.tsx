import React, { useState, useEffect } from 'react';
import { Task, TaskFrequency, ResourceLink } from '../types';
import { X, Check, Trash2, Plus, Clock, User, Folder, FileText, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !task) return null;

  const [title, setTitle] = useState(task.title);
  const [frequency, setFrequency] = useState<TaskFrequency>(task.frequency);
  const [owner, setOwner] = useState(task.owner);
  const [ownerRole, setOwnerRole] = useState(task.ownerRole || '');
  const [category, setCategory] = useState(task.category || 'Operations');
  const [stepsText, setStepsText] = useState(task.steps.join('\n'));
  const [links, setLinks] = useState<{ title: string; url: string }[]>(
    task.links && task.links.length > 0
      ? task.links.map((l) => ({ title: l.title, url: l.url }))
      : [{ title: '', url: '' }]
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setFrequency(task.frequency);
      setOwner(task.owner);
      setOwnerRole(task.ownerRole || '');
      setCategory(task.category || 'Operations');
      setStepsText(task.steps.join('\n'));
      setLinks(
        task.links && task.links.length > 0
          ? task.links.map((l) => ({ title: l.title, url: l.url }))
          : [{ title: '', url: '' }]
      );
    }
  }, [task]);

  const handleAddLinkRow = () => {
    setLinks([...links, { title: '', url: '' }]);
  };

  const handleRemoveLinkRow = (index: number) => {
    setLinks(links.filter((_, idx) => idx !== index));
  };

  const handleUpdateLink = (index: number, field: 'title' | 'url', val: string) => {
    const updated = [...links];
    updated[index][field] = val;
    setLinks(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !owner.trim()) return;

    const parsedSteps = stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const validLinks: ResourceLink[] = links
      .filter((l) => l.title.trim() && l.url.trim())
      .map((l, idx) => ({
        id: `link-edit-${Date.now()}-${idx}`,
        title: l.title.trim(),
        url: l.url.trim().startsWith('http') ? l.url.trim() : `https://${l.url.trim()}`,
      }));

    onSave({
      ...task,
      title: title.trim(),
      frequency,
      owner: owner.trim(),
      ownerRole: ownerRole.trim() || undefined,
      category: category.trim() || 'Operations',
      steps: parsedSteps.length > 0 ? parsedSteps : task.steps,
      links: validLinks,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
        />

        {/* Dialog Container */}
        <motion.div 
          id="edit-task-modal-dialog"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", damping: 26, stiffness: 360 }}
          className="relative z-10 w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
            <h3 className="text-base font-semibold text-stone-100">Edit Task &amp; SOP</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[38px]"
            />
          </div>

          {/* Cadence & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                Frequency *
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as TaskFrequency)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[38px]"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="One-off">One-off</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-stone-400" />
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[38px]"
              />
            </div>
          </div>

          {/* Owner & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                Owner Name *
              </label>
              <input
                type="text"
                required
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[38px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Owner Role
              </label>
              <input
                type="text"
                value={ownerRole}
                onChange={(e) => setOwnerRole(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[38px]"
              />
            </div>
          </div>

          {/* SOP Steps */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              SOP Steps (One per line)
            </label>
            <textarea
              rows={5}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans min-h-[100px]"
            />
          </div>

          {/* Resource Links */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-stone-400" />
                Resource Links
              </label>
              <button
                type="button"
                onClick={handleAddLinkRow}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer py-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add link</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {links.map((link, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-stone-800/40 p-2 sm:p-0 rounded-lg sm:bg-transparent">
                  <input
                    type="text"
                    placeholder="Label"
                    value={link.title}
                    onChange={(e) => handleUpdateLink(idx, 'title', e.target.value)}
                    className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[36px]"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                      className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[36px]"
                    />
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkRow(idx)}
                        className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
                        title="Remove link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-800 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer min-h-[38px] flex items-center justify-center"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[40px] sm:min-h-[38px]"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </motion.button>
          </div>
        </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
