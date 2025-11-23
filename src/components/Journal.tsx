import React, { useState, useEffect } from 'react';
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
      color: NOTE_COLORS[0].class,
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

  // Get current active glow for background
  const activeGlow = currentEntry
    ? NOTE_COLORS.find(c => c.class === currentEntry.color)?.glow
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex flex-col relative overflow-hidden transition-colors duration-1000"
    >
      {/* Dynamic Background Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-colors duration-1000 -z-10 ${activeGlow || 'from-slate-900 to-black'}`}
        style={{ opacity: view === 'edit' ? 0.4 : 0 }}
      />

      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent sticky top-0 backdrop-blur-sm">
        <button
          onClick={view === 'edit' ? () => setView('list') : onBack}
          className="p-3 gravity-button rounded-full text-slate-300 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-lg font-bold uppercase tracking-widest text-starlight">
          {view === 'list' ? 'Journal' : 'Edit Note'}
        </h2>

        {view === 'list' ? (
          <button
            onClick={handleNewEntry}
            className="p-3 rounded-full bg-aurora-500/20 text-aurora-400 hover:bg-aurora-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(45,212,191,0.3)]"
          >
            <Plus size={24} />
          </button>
        ) : (
          <button
            onClick={handleSaveEntry}
            className="px-6 py-3 rounded-full bg-nebula-500/20 text-nebula-400 hover:bg-nebula-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
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
            className="flex-1 px-4 pb-24 overflow-y-auto"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>

            {/* Grid of Notes */}
            {filteredEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Edit3 size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-mono uppercase tracking-widest">No entries yet</p>
                <button onClick={handleNewEntry} className="mt-4 text-aurora-400 hover:underline text-sm">Create your first note</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredEntries.map((entry) => (
                  <motion.button
                    key={entry.id}
                    layoutId={`note-${entry.id}`}
                    onClick={() => handleEditEntry(entry)}
                    className={`text-left p-5 rounded-3xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-95 group flex flex-col h-48 relative overflow-hidden ${entry.color}`}
                  >
                    <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 relative z-10">{entry.title}</h3>
                    <p className="text-slate-200 text-sm leading-relaxed line-clamp-3 mb-auto font-light relative z-10 opacity-90">
                      {entry.content || <span className="italic opacity-50">No content</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 w-full relative z-10">
                      <Calendar size={12} className="text-slate-300" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.button>
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
            className="flex-1 flex flex-col px-6 pb-6 max-w-2xl mx-auto w-full"
          >
            {/* Color Picker - Enhanced */}
            <div className="mb-6 relative z-30">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Palette size={14} />
                <span>Theme</span>
              </div>
              <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
                {NOTE_COLORS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setCurrentEntry(prev => prev ? { ...prev, color: theme.class } : null)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex-shrink-0 flex items-center justify-center ${theme.class.split(' ')[0]} ${currentEntry?.color === theme.class ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    title={theme.label}
                  >
                    {currentEntry?.color === theme.class && <Check size={16} className="text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>

            <div className={`flex-1 rounded-3xl p-6 border backdrop-blur-xl flex flex-col transition-all duration-500 relative z-10 ${currentEntry?.color || NOTE_COLORS[0].class}`}>
              <input
                type="text"
                value={currentEntry?.title || ''}
                onChange={(e) => setCurrentEntry(prev => prev ? { ...prev, title: e.target.value } : null)}
                placeholder="Title"
                className="bg-transparent border-none text-3xl font-bold text-white placeholder:text-white/30 focus:outline-none mb-4 w-full drop-shadow-md"
              />

              <div className="flex items-center gap-2 mb-6 text-white/60 text-xs font-mono uppercase tracking-widest">
                <Calendar size={12} />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>

              <textarea
                value={currentEntry?.content || ''}
                onChange={(e) => setCurrentEntry(prev => prev ? { ...prev, content: e.target.value } : null)}
                placeholder="Start writing..."
                className="flex-1 bg-transparent border-none text-lg leading-relaxed text-slate-50 placeholder:text-white/20 focus:outline-none resize-none font-sans drop-shadow-sm"
              />
            </div>

            {/* Delete Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleDeleteEntry}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-red-500/10 transition-colors"
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
