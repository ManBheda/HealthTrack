import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { BookOpen, Calendar, Plus, Heart, Tag, Search, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const MentalHealthJournal: React.FC = () => {
  const { journalEntries, addJournalEntry } = useHealth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Add a tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle key press for tag input
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  // Submit new journal entry
  const submitJournalEntry = () => {
    if (!title.trim() || !content.trim() || !mood.trim()) return;
    
    addJournalEntry({
      id: Date.now().toString(),
      date: today,
      title: title.trim(),
      content: content.trim(),
      tags,
      mood
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setMood('');
    setTags([]);
    setShowAddForm(false);
  };
  
  // Toggle expanded entry
  const toggleExpandEntry = (id: string) => {
    if (expandedEntryId === id) {
      setExpandedEntryId(null);
    } else {
      setExpandedEntryId(id);
    }
  };
  
  // Filter entries by search term
  const filteredEntries = journalEntries.filter(entry => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.title.toLowerCase().includes(searchLower) ||
      entry.content.toLowerCase().includes(searchLower) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      entry.mood.toLowerCase().includes(searchLower)
    );
  });
  
  // Group entries by week
  const groupEntriesByWeek = () => {
    const grouped: Record<string, typeof journalEntries> = {};
    
    filteredEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      // Get the week of the year
      const weekStart = new Date(entryDate);
      weekStart.setDate(entryDate.getDate() - entryDate.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = [];
      }
      
      grouped[weekKey].push(entry);
    });
    
    return grouped;
  };
  
  const groupedEntries = groupEntriesByWeek();
  
  // Sort weeks in reverse chronological order
  const sortedWeeks = Object.keys(groupedEntries).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Get all unique tags from entries
  const allTags = Array.from(
    new Set(journalEntries.flatMap(entry => entry.tags))
  );
  
  // Get all unique moods from entries
  const allMoods = Array.from(
    new Set(journalEntries.map(entry => entry.mood))
  );
  
  // Get mood emoji
  const getMoodEmoji = (mood: string) => {
    switch(mood.toLowerCase()) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'neutral': return '😐';
      case 'excited': return '😃';
      case 'tired': return '😴';
      case 'stressed': return '😰';
      case 'calm': return '😌';
      case 'energetic': return '⚡';
      case 'anxious': return '😟';
      case 'grateful': return '🙏';
      case 'hopeful': return '🌈';
      case 'motivated': return '💪';
      default: return '😐';
    }
  };
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Mental Health Journal</h1>
      
      {/* Journal Controls */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center">
            <BookOpen size={20} className="text-purple-600 mr-2" />
            <h2 className="text-lg font-medium">Your Journal</h2>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700"
            >
              <Plus size={18} className="mr-1" />
              New Entry
            </button>
          </div>
        </div>
        
        {/* Tag cloud */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Tag size={16} className="text-gray-500 mr-2" />
            <h3 className="text-sm font-medium">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className={`px-2 py-1 rounded-lg text-xs ${
                  searchTerm === tag 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                {tag}
              </button>
            ))}
            {allTags.length === 0 && (
              <span className="text-sm text-gray-500">No tags yet</span>
            )}
          </div>
        </div>
        
        {/* Mood filter */}
        <div>
          <div className="flex items-center mb-2">
            <Heart size={16} className="text-gray-500 mr-2" />
            <h3 className="text-sm font-medium">Moods</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {allMoods.map(mood => (
              <button
                key={mood}
                onClick={() => setSearchTerm(mood)}
                className={`px-2 py-1 rounded-lg text-xs flex items-center ${
                  searchTerm === mood 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{getMoodEmoji(mood)}</span>
                {mood}
              </button>
            ))}
            {allMoods.length === 0 && (
              <span className="text-sm text-gray-500">No moods recorded yet</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Entry Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
          <h2 className="text-lg font-medium mb-4">New Journal Entry</h2>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="How are you feeling today?"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Journal Entry
            </label>
            <textarea
              id="content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Write your thoughts here..."
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Mood
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {[
                'happy', 'sad', 'neutral', 'excited', 
                'tired', 'stressed', 'calm', 'energetic',
                'anxious', 'grateful', 'hopeful', 'motivated'
              ].map(moodOption => (
                <button
                  key={moodOption}
                  onClick={() => setMood(moodOption)}
                  className={`p-2 flex flex-col items-center rounded-lg capitalize ${
                    mood === moodOption 
                      ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl mb-1">{getMoodEmoji(moodOption)}</span>
                  <span className="text-xs">{moodOption}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Add a tag, press Enter"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-purple-600 text-white rounded-r-lg"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <div 
                    key={tag} 
                    className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={submitJournalEntry}
              className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Save Entry
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Journal Entries */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Journal Entries</h2>
        
        {filteredEntries.length > 0 ? (
          <div className="space-y-6">
            {sortedWeeks.map(weekStart => {
              const weekEntries = groupedEntries[weekStart];
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekEnd.getDate() + 6);
              
              return (
                <div key={weekStart}>
                  <div className="flex items-center mb-3">
                    <Calendar size={16} className="text-purple-600 mr-2" />
                    <h3 className="text-sm font-medium">
                      Week of {new Date(weekStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      {' - '}
                      {weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {weekEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                      <div key={entry.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div 
                          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleExpandEntry(entry.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl mr-3">
                              {getMoodEmoji(entry.mood)}
                            </div>
                            <div>
                              <h4 className="font-medium">{entry.title}</h4>
                              <p className="text-xs text-gray-500">
                                {formatDate(entry.date)} · {entry.mood}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {entry.tags.length > 0 && (
                              <div className="hidden md:flex mr-4">
                                {entry.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded mr-1">
                                    {tag}
                                  </span>
                                ))}
                                {entry.tags.length > 2 && (
                                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                    +{entry.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {expandedEntryId === entry.id ? (
                              <ChevronUp size={18} className="text-gray-500" />
                            ) : (
                              <ChevronDown size={18} className="text-gray-500" />
                            )}
                          </div>
                        </div>
                        
                        {expandedEntryId === entry.id && (
                          <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{entry.content}</p>
                            
                            {entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {entry.tags.map(tag => (
                                  <span key={tag} className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex justify-end space-x-2">
                              <button className="p-2 text-blue-600 rounded-lg hover:bg-blue-50">
                                <Edit size={16} />
                              </button>
                              <button className="p-2 text-red-600 rounded-lg hover:bg-red-50">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <BookOpen size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 mb-2">
              {searchTerm ? 'No entries match your search' : 'Your journal is empty'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setShowAddForm(true);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg inline-flex items-center"
            >
              <Plus size={16} className="mr-1" />
              {searchTerm ? 'Clear Search & Add Entry' : 'Add Your First Entry'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};