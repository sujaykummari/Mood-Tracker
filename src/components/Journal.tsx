import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, Search, Calendar, Edit3, Palette, Check } from 'lucide-react';

/**
 * Props for the Journal component.
 */
interface JournalProps {
  onBack: () => void;
}

/**
 * Data structure for a single journal entry.
 */
interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  color: string; // CSS class for background
}

/**
 * Expanded color palette with more vibrant options.
 * Increased opacity for better visibility.
 */
const NOTE_COLORS = [
  { id: 'nebula', class: 'bg-indigo-500/30 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]', label: 'Nebula', glow: 'from-indigo-900/50 to-black' },
  { id: 'aurora', class: 'bg-teal-500/30 border-teal-500/50 shadow-[0_0_30px_rgba(45,212,191,0.15)]', label: 'Aurora', glow: 'from-teal-900/50 to-black' },
  { id: 'plasma', class: 'bg-purple-500/30 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]', label: 'Plasma', glow: 'from-purple-900/50 to-black' },
  { id: 'solar', class: 'bg-orange-500/30 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)]', label: 'Solar', glow: 'from-orange-900/50 to-black' },
  { id: 'mars', class: 'bg-rose-500/30 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]', label: 'Mars', glow: 'from-rose-900/50 to-black' },
  { id: 'ocean', class: 'bg-sky-500/30 border-sky-500/50 shadow-[0_0_30px_rgba(14,165,233,0.15)]', label: 'Ocean', glow: 'from-sky-900/50 to-black' },
  { id: 'terra', class: 'bg-emerald-500/30 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]', label: 'Terra', glow: 'from-emerald-900/50 to-black' },
  { id: 'lunar', class: 'bg-slate-500/30 border-slate-500/50 shadow-[0_0_30px_rgba(100,116,139,0.15)]', label: 'Lunar', glow: 'from-slate-900/50 to-black' },
  { id: 'gold', class: 'bg-yellow-500/30 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.15)]', label: 'Gold', glow: 'from-yellow-900/50 to-black' },
  { id: 'love', class: 'bg-pink-500/30 border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.15)]', label: 'Love', glow: 'from-pink-900/50 to-black' },
  { id: 'void', class: 'bg-black/60 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]', label: 'Void', glow: 'from-black to-black' },
];

/**
 * Journal component.
 * A full-featured "Notes App" style journal with multiple entries, colors, and grid view.
 */
export function Journal({ onBack }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load entries from local storage
  useEffect(() => {
    const savedEntries = localStorage.getItem('journal_entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  /**
   * Saves the list of entries to local storage.
   */
  const saveToStorage = (updatedEntries: JournalEntry[]) => {
    localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
  };

  /**
   * Opens the editor for a new entry.
   */
  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: '',
      content: '',
      color: NOTE_COLORS[0].id,
    };
    setCurrentEntry(newEntry);
    setView('edit');
  };

  /**
   * Opens an existing entry for editing.
   */
  const handleEditEntry = (entry: JournalEntry) => {
    setCurrentEntry({ ...entry }); // Clone to avoid direct mutation
    setView('edit');
  };

  /**
   * Saves the current entry (create or update).
   */
  const handleSaveEntry = () => {
    if (!currentEntry) return;

    // If title is empty, set a default
    const entryToSave = {
      ...currentEntry,
      title: currentEntry.title.trim() || 'Untitled Note',
      date: new Date().toISOString(), // Update timestamp on save
    };

    const existingIndex = entries.findIndex(e => e.id === entryToSave.id);
    let updatedEntries;

    if (existingIndex >= 0) {
      // Update existing
      updatedEntries = [...entries];
      updatedEntries[existingIndex] = entryToSave;
    } else {
      // Create new (prepend to list)
      updatedEntries = [entryToSave, ...entries];
    }

    saveToStorage(updatedEntries);
    setView('list');
    setCurrentEntry(null);
  };

  /**
   * Deletes the current entry.
   */
  const handleDeleteEntry = () => {
    if (!currentEntry) return;
    const updatedEntries = entries.filter(e => e.id !== currentEntry.id);
    saveToStorage(updatedEntries);
    setView('list');
    setCurrentEntry(null);
  };

  // Filter entries for search
  const filteredEntries = entries.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );



  // Map colors to inline styles or Bootstrap classes
  const getNoteStyle = (colorId: string) => {
    const styles: Record<string, any> = {
      nebula: { backgroundColor: 'rgba(99, 102, 241, 0.3)', borderColor: 'rgba(99, 102, 241, 0.5)', boxShadow: '0 0 30px rgba(99, 102, 241, 0.15)' },
      aurora: { backgroundColor: 'rgba(45, 212, 191, 0.3)', borderColor: 'rgba(45, 212, 191, 0.5)', boxShadow: '0 0 30px rgba(45, 212, 191, 0.15)' },
      plasma: { backgroundColor: 'rgba(168, 85, 247, 0.3)', borderColor: 'rgba(168, 85, 247, 0.5)', boxShadow: '0 0 30px rgba(168, 85, 247, 0.15)' },
      solar: { backgroundColor: 'rgba(249, 115, 22, 0.3)', borderColor: 'rgba(249, 115, 22, 0.5)', boxShadow: '0 0 30px rgba(249, 115, 22, 0.15)' },
      mars: { backgroundColor: 'rgba(244, 63, 94, 0.3)', borderColor: 'rgba(244, 63, 94, 0.5)', boxShadow: '0 0 30px rgba(244, 63, 94, 0.15)' },
      ocean: { backgroundColor: 'rgba(14, 165, 233, 0.3)', borderColor: 'rgba(14, 165, 233, 0.5)', boxShadow: '0 0 30px rgba(14, 165, 233, 0.15)' },
      terra: { backgroundColor: 'rgba(16, 185, 129, 0.3)', borderColor: 'rgba(16, 185, 129, 0.5)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.15)' },
      lunar: { backgroundColor: 'rgba(100, 116, 139, 0.3)', borderColor: 'rgba(100, 116, 139, 0.5)', boxShadow: '0 0 30px rgba(100, 116, 139, 0.15)' },
      gold: { backgroundColor: 'rgba(234, 179, 8, 0.3)', borderColor: 'rgba(234, 179, 8, 0.5)', boxShadow: '0 0 30px rgba(234, 179, 8, 0.15)' },
      love: { backgroundColor: 'rgba(236, 72, 153, 0.3)', borderColor: 'rgba(236, 72, 153, 0.5)', boxShadow: '0 0 30px rgba(236, 72, 153, 0.15)' },
      void: { backgroundColor: 'rgba(0, 0, 0, 0.6)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 0 30px rgba(255, 255, 255, 0.05)' },
    };
    return styles[colorId] || styles.nebula;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-vh-100 w-100 d-flex flex-column position-relative overflow-hidden transition-colors duration-1000"
    >
      {/* Dynamic Background Glow - simplified for now */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: currentEntry ? `radial-gradient(circle at center, ${getNoteStyle(currentEntry.color.split('-')[0] || 'nebula').backgroundColor}, transparent 70%)` : 'none',
          opacity: view === 'edit' ? 0.4 : 0,
          zIndex: -1,
          transition: 'opacity 1s ease'
        }}
      />

      {/* Header */}
      <header className="p-4 d-flex align-items-center justify-content-between z-3 sticky-top backdrop-blur-sm" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
        <button
          onClick={view === 'edit' ? () => setView('list') : onBack}
          className="btn btn-link text-secondary p-2 rounded-circle hover-text-white gravity-button"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="h5 fw-bold text-uppercase tracking-widest text-light mb-0">
          {view === 'list' ? 'Journal' : 'Edit Note'}
        </h2>

        {view === 'list' ? (
          <button
            onClick={handleNewEntry}
            className="btn btn-link p-2 rounded-circle text-info hover-bg-info hover-text-white transition-all shadow-sm"
            style={{ backgroundColor: 'rgba(45, 212, 191, 0.2)' }}
          >
            <Plus size={24} />
          </button>
        ) : (
          <button
            onClick={handleSaveEntry}
            className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-bold text-uppercase small shadow-sm"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.5)', borderColor: 'rgba(99, 102, 241, 0.5)' }}
          >
            <Save size={18} />
            <span>Save</span>
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-4 pb-5 overflow-auto"
          >
            {/* Search Bar */}
            <div className="position-relative mb-4">
              <Search className="position-absolute top-50 translate-middle-y text-secondary" style={{ left: '1rem' }} size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="form-control bg-transparent border-secondary text-light placeholder-secondary rounded-pill py-2 ps-5 pe-3"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Grid of Notes */}
            {filteredEntries.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 text-secondary">
                <Edit3 size={48} className="mb-3 opacity-25" />
                <p className="small font-monospace text-uppercase tracking-widest">No entries yet</p>
                <button onClick={handleNewEntry} className="btn btn-link text-info text-decoration-none small">Create your first note</button>
              </div>
            ) : (
              <div className="row g-3">
                {filteredEntries.map((entry) => (
                  <div className="col-12 col-sm-6" key={entry.id}>
                    <motion.button
                      layoutId={`note-${entry.id}`}
                      onClick={() => handleEditEntry(entry)}
                      className="btn border w-100 text-start p-4 rounded-4 backdrop-blur-md transition-transform hover-scale-102 active-scale-95 d-flex flex-column position-relative overflow-hidden"
                      style={{ height: '200px', ...getNoteStyle(entry.color.split('-')[0] || 'nebula') }}
                    >
                      <h3 className="h5 fw-bold text-white mb-2 text-truncate position-relative z-1">{entry.title}</h3>
                      <p className="text-light small opacity-75 mb-auto position-relative z-1 text-truncate-3" style={{ whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {entry.content || <span className="fst-italic opacity-50">No content</span>}
                      </p>
                      <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top border-white border-opacity-10 w-100 position-relative z-1">
                        <Calendar size={12} className="text-light opacity-50" />
                        <span className="small font-monospace text-uppercase tracking-widest text-light opacity-50" style={{ fontSize: '10px' }}>
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 d-flex flex-column px-4 pb-4 mx-auto w-100"
            style={{ maxWidth: '700px' }}
          >
            {/* Color Picker */}
            <div className="mb-4 position-relative z-3">
              <div className="d-flex align-items-center gap-2 mb-2 small fw-bold text-secondary text-uppercase tracking-widest">
                <Palette size={14} />
                <span>Theme</span>
              </div>
              <div className="d-flex gap-2 overflow-auto py-2 no-scrollbar">
                {NOTE_COLORS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setCurrentEntry(prev => prev ? { ...prev, color: theme.id } : null)}
                    className={`btn rounded-circle border-2 p-0 d-flex align-items-center justify-content-center flex-shrink-0 transition-all ${currentEntry?.color === theme.id ? 'border-white scale-110 shadow' : 'border-transparent opacity-50 hover-opacity-100'}`}
                    style={{ width: '40px', height: '40px', ...getNoteStyle(theme.id) }}
                    title={theme.label}
                  >
                    {currentEntry?.color === theme.id && <Check size={16} className="text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="flex-1 rounded-4 p-4 border backdrop-blur-xl d-flex flex-column transition-all position-relative z-1"
              style={currentEntry ? getNoteStyle(currentEntry.color.split('-')[0] || 'nebula') : {}}
            >
              <input
                type="text"
                value={currentEntry?.title || ''}
                onChange={(e) => setCurrentEntry(prev => prev ? { ...prev, title: e.target.value } : null)}
                placeholder="Title"
                className="form-control bg-transparent border-0 fs-2 fw-bold text-white placeholder-white-50 shadow-none mb-3"
              />

              <div className="d-flex align-items-center gap-2 mb-4 text-white-50 small font-monospace text-uppercase tracking-widest">
                <Calendar size={12} />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>

              <textarea
                value={currentEntry?.content || ''}
                onChange={(e) => setCurrentEntry(prev => prev ? { ...prev, content: e.target.value } : null)}
                placeholder="Start writing..."
                className="form-control flex-1 bg-transparent border-0 fs-5 text-light placeholder-white-50 shadow-none resize-none"
                style={{ minHeight: '200px' }}
              />
            </div>

            {/* Delete Button */}
            <div className="mt-4 d-flex justify-center">
              <button
                onClick={handleDeleteEntry}
                className="btn btn-link text-danger text-decoration-none d-flex align-items-center gap-2 small fw-bold text-uppercase tracking-widest px-3 py-2 rounded-pill hover-bg-danger-10"
              >
                <Trash2 size={16} />
                Delete Note
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
