import React, { useState } from 'react';
import { Task, TaskFrequency, ResourceLink, ViewRoute } from '../types';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  FileText, 
  User, 
  Clock, 
  Folder, 
  Link as LinkIcon, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface NewTaskViewProps {
  onRouteChange: (route: ViewRoute) => void;
  onAddTask: (newTask: Omit<Task, 'id' | 'createdAt' | 'history'>) => void;
}

export const NewTaskView: React.FC<NewTaskViewProps> = ({
  onRouteChange,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<TaskFrequency>('Weekly');
  const [owner, setOwner] = useState('');
  const [ownerRole, setOwnerRole] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedByRole, setAssignedByRole] = useState('Senior Leadership');
  const [category, setCategory] = useState('Operations');
  const [estDurationMinutes, setEstDurationMinutes] = useState<number>(30);
  
  // SOP steps: text area or line array
  const [stepsText, setStepsText] = useState(
    'Verify preliminary inputs and dependencies.\nExecute primary operational procedure.\nDouble check verification numbers.\nArchive artifact in shared drive.\nNotify team on Slack.'
  );

  // Resource links
  const [links, setLinks] = useState<{ title: string; url: string }[]>([
    { title: '', url: '' },
  ]);

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

    if (!title.trim() || !owner.trim()) {
      return;
    }

    // Split stepsText by newlines and filter out empty lines
    const parsedSteps = stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Format valid resource links
    const validLinks: ResourceLink[] = links
      .filter((l) => l.title.trim() && l.url.trim())
      .map((l, idx) => ({
        id: `link-new-${Date.now()}-${idx}`,
        title: l.title.trim(),
        url: l.url.trim().startsWith('http') ? l.url.trim() : `https://${l.url.trim()}`,
      }));

    onAddTask({
      title: title.trim(),
      frequency,
      owner: owner.trim(),
      ownerRole: ownerRole.trim() || undefined,
      assignedBy: assignedBy.trim() || undefined,
      assignedByRole: assignedByRole.trim() || undefined,
      category: category.trim() || 'Operations',
      estDurationMinutes: estDurationMinutes || undefined,
      steps: parsedSteps.length > 0 ? parsedSteps : ['Execute standard task.'],
      links: validLinks,
      lastCompletedAt: null,
    });
  };

  return (
    <div id="new-task-page-container" className="max-w-3xl mx-auto space-y-6 pb-16">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-400 border-b border-stone-800 pb-4">
        <button
          onClick={() => onRouteChange({ name: 'tasks' })}
          className="hover:text-stone-100 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tasks</span>
        </button>
        <span>/</span>
        <span className="text-stone-300 font-medium">New Task</span>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
        
        {/* Header */}
        <div className="border-b border-stone-800 pb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
            Create Task
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Standardize a recurring task with clear owner, cadence, and step-by-step instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-200 mb-1.5 flex items-center gap-1.5">
              <span>Task Title</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              id="new-task-title-input"
              type="text"
              required
              placeholder="e.g. Weekly Executive Financial Summary or Client Onboarding Checklist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[40px]"
            />
          </div>

          {/* Grid: Frequency, Owner, Role, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Frequency */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Frequency (Cadence)</span>
                <span className="text-rose-400">*</span>
              </label>
              <select
                id="new-task-frequency-select"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as TaskFrequency)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Daily">Daily (Every day)</option>
                <option value="Weekly">Weekly (Every 7 days)</option>
                <option value="Monthly">Monthly (Every 30 days)</option>
                <option value="One-off">One-off (Ad-hoc procedure)</option>
              </select>
            </div>

            {/* Category / Department */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-stone-400" />
                <span>Department / Category</span>
              </label>
              <select
                id="new-task-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Operations">Operations</option>
                <option value="Client Success">Client Success</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="IT & Security">IT &amp; Security</option>
                <option value="Product">Product</option>
                <option value="People Ops">People Ops</option>
              </select>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Task Owner (Name)</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                id="new-task-owner-input"
                type="text"
                required
                placeholder="e.g. Sarah Chen or Alex Rivera"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Owner Role */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5 flex items-center gap-1.5">
                <span>Owner Role / Title</span>
              </label>
              <input
                id="new-task-role-input"
                type="text"
                placeholder="e.g. Client Success Lead or DevOps Lead"
                value={ownerRole}
                onChange={(e) => setOwnerRole(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Assigned By Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Assigned By (Name)</span>
              </label>
              <input
                id="new-task-assignedby-input"
                type="text"
                placeholder="e.g. Jane Doe"
                value={assignedBy}
                onChange={(e) => setAssignedBy(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Assigned By Role */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5 flex items-center gap-1.5">
                <span>Assigned By Role</span>
              </label>
              <select
                id="new-task-assignedbyrole-select"
                value={assignedByRole}
                onChange={(e) => setAssignedByRole(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Senior Leadership">Senior Leadership</option>
                <option value="Manager">Manager</option>
                <option value="Peer">Peer</option>
              </select>
            </div>

          </div>

          {/* SOP Steps */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-400" />
                <span>Steps (One step per line)</span>
                <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-stone-400">
                Numbered automatically on save
              </span>
            </div>
            <textarea
              id="new-task-steps-textarea"
              rows={6}
              required
              placeholder="1. Verify signed client service agreement&#10;2. Provision dashboard access&#10;3. Schedule 30-min kickoff call"
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Press Enter between each operational step. Team members will be able to check these off interactively.
            </p>
          </div>

          {/* Resource Links (Optional) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-stone-400" />
                <span>Resource &amp; Documentation Links (Optional)</span>
              </label>
              <button
                type="button"
                id="btn-add-resource-link-row"
                onClick={handleAddLinkRow}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add another link</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {links.map((link, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-stone-800/40 p-2.5 sm:p-0 rounded-lg sm:bg-transparent">
                  <input
                    type="text"
                    placeholder="Link Label (e.g. Notion Client Hub)"
                    value={link.title}
                    onChange={(e) => handleUpdateLink(idx, 'title', e.target.value)}
                    className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[38px]"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      placeholder="URL (e.g. https://notion.so/...)"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                      className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[38px]"
                    />
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkRow(idx)}
                        className="p-2 text-stone-500 hover:text-rose-400 rounded-lg shrink-0 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                        title="Remove link row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-800 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              id="new-task-cancel-btn"
              onClick={() => onRouteChange({ name: 'tasks' })}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="new-task-submit-btn"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm shadow-emerald-950/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
            >
              <Check className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
