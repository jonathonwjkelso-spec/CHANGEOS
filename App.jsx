import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { AlertTriangle, TrendingDown, TrendingUp, Minus, Clock, Activity, Users, Wrench, Eye, MessageSquare, FileText, ChevronDown, ChevronRight, Radio, Zap, Shield, ArrowRight, Compass, Lightbulb, Target, BookOpen, Layers, ArrowLeft, Mail, Linkedin, Menu, X, Calculator, Map, Brain, HelpCircle, Download, Check, Heart, ChevronLeft, Settings, Key, Plus, Play, Loader2, Save, Trash2, Copy, RefreshCw } from 'lucide-react';
import { demoInitiative, demoAnalysis, demoInputs } from './data/demoData';

// localStorage keys
const STORAGE_KEYS = {
  API_KEY: 'changeos_api_key',
  SIGNALS: 'changeos_signals',
  INITIATIVE: 'changeos_initiative',
  ANALYSIS: 'changeos_analysis',
};

// Helper functions for localStorage
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch { return null; }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { console.error('Storage error:', e); }
  },
  remove: (key) => localStorage.removeItem(key),
};

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentTool, setCurrentTool] = useState(null);
  const [currentKnowledge, setCurrentKnowledge] = useState(null);
  const [expandedCluster, setExpandedCluster] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mode, setMode] = useState('demo'); // 'demo' or 'live'
  const [showSettings, setShowSettings] = useState(false);
  
  const navigate = (page, sub = null) => { 
    setCurrentPage(page); 
    if (page === 'tools') setCurrentTool(sub); 
    if (page === 'knowledge') setCurrentKnowledge(sub); 
  };
  
  if (currentPage === 'landing') return <LandingPage onNavigate={navigate} />;
  if (currentPage === 'tools') return <ToolsPage currentTool={currentTool} onNavigate={navigate} />;
  if (currentPage === 'knowledge') return <KnowledgePage currentKnowledge={currentKnowledge} onNavigate={navigate} />;
  if (currentPage === 'demo') return (
    <>
      <ChangeOSApp 
        mode={mode} 
        setMode={setMode} 
        expandedCluster={expandedCluster} 
        setExpandedCluster={setExpandedCluster} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNavigate={navigate}
        onOpenSettings={() => setShowSettings(true)}
      />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
  return <LandingPage onNavigate={navigate} />;
}

// Settings Modal Component
function SettingsModal({ onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    const stored = storage.get(STORAGE_KEYS.API_KEY);
    if (stored) setApiKey(stored);
  }, []);
  
  const handleSave = () => {
    storage.set(STORAGE_KEYS.API_KEY, apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const handleClearData = () => {
    if (confirm('This will clear all your signals and analysis. Continue?')) {
      storage.remove(STORAGE_KEYS.SIGNALS);
      storage.remove(STORAGE_KEYS.ANALYSIS);
      storage.remove(STORAGE_KEYS.INITIATIVE);
      window.location.reload();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[Sora] text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Settings
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Key className="w-4 h-4 inline mr-2" />
              Claude API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <p className="text-xs text-slate-500 mt-2">
              Your API key is stored locally in your browser. Never shared.
            </p>
            <button 
              onClick={handleSave}
              className="mt-3 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium rounded-lg flex items-center gap-2"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Key'}
            </button>
          </div>
          
          {/* Data Management */}
          <div className="pt-4 border-t border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Data Management
            </label>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const data = {
                    signals: storage.get(STORAGE_KEYS.SIGNALS) || [],
                    initiative: storage.get(STORAGE_KEYS.INITIATIVE),
                    analysis: storage.get(STORAGE_KEYS.ANALYSIS),
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `changeos-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Export Backup
              </button>
              <button 
                onClick={handleClearData}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </div>
          
          {/* Info */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-sm text-slate-400">
              <strong className="text-slate-300">How to get an API key:</strong><br />
              1. Go to <span className="text-cyan-400">console.anthropic.com</span><br />
              2. Create an account or sign in<br />
              3. Navigate to API Keys<br />
              4. Create a new key and paste it here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main ChangeOS App (handles both Demo and Live modes)
function ChangeOSApp({ mode, setMode, expandedCluster, setExpandedCluster, activeTab, setActiveTab, onNavigate, onOpenSettings }) {
  // Live mode state
  const [signals, setSignals] = useState([]);
  const [initiative, setInitiative] = useState({ name: 'My Initiative', organisation: 'My Organisation', timeline: 12 });
  const [analysis, setAnalysis] = useState(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  
  // Load from localStorage on mount
  useEffect(() => {
    const storedSignals = storage.get(STORAGE_KEYS.SIGNALS);
    const storedInitiative = storage.get(STORAGE_KEYS.INITIATIVE);
    const storedAnalysis = storage.get(STORAGE_KEYS.ANALYSIS);
    if (storedSignals) setSignals(storedSignals);
    if (storedInitiative) setInitiative(storedInitiative);
    if (storedAnalysis) setAnalysis(storedAnalysis);
  }, []);
  
  // Save signals to localStorage when they change
  useEffect(() => {
    if (signals.length > 0) {
      storage.set(STORAGE_KEYS.SIGNALS, signals);
    }
  }, [signals]);
  
  // Get current data based on mode
  const currentInitiative = mode === 'demo' ? demoInitiative : initiative;
  const currentAnalysis = mode === 'demo' ? demoAnalysis : analysis;
  const currentInputs = mode === 'demo' ? demoInputs : signals;
  
  // Run analysis function
  const runAnalysis = async () => {
    const apiKey = storage.get(STORAGE_KEYS.API_KEY);
    if (!apiKey) {
      setAnalysisError('Please add your Claude API key in Settings first.');
      return;
    }
    if (signals.length === 0) {
      setAnalysisError('Add at least one signal before running analysis.');
      return;
    }
    
    setIsAnalysing(true);
    setAnalysisError(null);
    
    try {
      const result = await analyseSignals(apiKey, signals, initiative);
      setAnalysis(result);
      storage.set(STORAGE_KEYS.ANALYSIS, result);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(error.message || 'Analysis failed. Check your API key and try again.');
    } finally {
      setIsAnalysing(false);
    }
  };
  
  // Add signal function
  const addSignal = (signal) => {
    const newSignal = {
      ...signal,
      id: `signal-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setSignals(prev => [...prev, newSignal]);
  };
  
  // Delete signal function
  const deleteSignal = (id) => {
    setSignals(prev => prev.filter(s => s.id !== id));
  };
  
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 hover:opacity-80">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <Radio className="w-4 h-4 text-white" />
                </div>
                <span className="font-[Sora] font-bold text-lg tracking-tight">ChangeOS</span>
              </button>
              <div className="h-6 w-px bg-slate-700"></div>
              <div>
                <div className="text-sm font-semibold text-slate-200">{currentInitiative.name}</div>
                <div className="text-xs text-slate-500">{currentInitiative.organisation}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Mode Toggle */}
              <div className="flex items-center bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setMode('demo')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    mode === 'demo' 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Demo
                </button>
                <button
                  onClick={() => setMode('live')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    mode === 'live' 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live
                </button>
              </div>
              
              <button 
                onClick={onOpenSettings}
                className="p-2 text-slate-400 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button onClick={() => onNavigate('landing')} className="text-sm text-slate-400 hover:text-white">
                ← Back
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <nav className="border-b border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'signals', label: 'Signals' },
              { id: 'inputs', label: mode === 'demo' ? 'Inputs' : 'Add Signals' },
              ...(mode === 'live' ? [{ id: 'brief', label: 'Weekly Brief' }] : []),
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Analysis Controls for Live Mode */}
        {mode === 'live' && activeTab === 'dashboard' && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-200">Analysis Engine</h3>
                <p className="text-sm text-slate-400">
                  {signals.length} signal{signals.length !== 1 ? 's' : ''} ready for analysis
                  {analysis && ` • Last run: ${new Date(analysis.lastRun).toLocaleString()}`}
                </p>
              </div>
              <button
                onClick={runAnalysis}
                disabled={isAnalysing || signals.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalysing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analysing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Analysis
                  </>
                )}
              </button>
            </div>
            {analysisError && (
              <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
                {analysisError}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'dashboard' && currentAnalysis && (
          <Dashboard analysis={currentAnalysis} expandedCluster={expandedCluster} setExpandedCluster={setExpandedCluster} />
        )}
        {activeTab === 'dashboard' && !currentAnalysis && mode === 'live' && (
          <EmptyDashboard onAddSignal={() => setActiveTab('inputs')} />
        )}
        {activeTab === 'signals' && currentAnalysis && <SignalsView analysis={currentAnalysis} />}
        {activeTab === 'signals' && !currentAnalysis && mode === 'live' && (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Run analysis to see signal patterns</p>
          </div>
        )}
        {activeTab === 'inputs' && mode === 'demo' && <InputsView inputs={currentInputs} />}
        {activeTab === 'inputs' && mode === 'live' && (
          <SignalInputView 
            signals={signals} 
            onAddSignal={addSignal} 
            onDeleteSignal={deleteSignal}
            initiative={initiative}
            setInitiative={setInitiative}
          />
        )}
        {activeTab === 'brief' && mode === 'live' && (
          <WeeklyBriefView analysis={analysis} initiative={initiative} signals={signals} />
        )}
      </main>
      
      <footer className="border-t border-slate-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Line Of Flight · ChangeOS</span>
            </div>
            <div>Created by Jonathon Kelso · 2025</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Empty Dashboard State
function EmptyDashboard({ onAddSignal }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
        <Radio className="w-8 h-8 text-slate-600" />
      </div>
      <h2 className="font-[Sora] text-xl font-bold text-white mb-2">No Analysis Yet</h2>
      <p className="text-slate-400 mb-6 max-w-md mx-auto">
        Add signals from your change initiative, then run analysis to see predictions and insights.
      </p>
      <button
        onClick={onAddSignal}
        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-medium rounded-xl flex items-center gap-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        Add Your First Signal
      </button>
    </div>
  );
}

// Signal Input View (for Live mode)
function SignalInputView({ signals, onAddSignal, onDeleteSignal, initiative, setInitiative }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSignal, setNewSignal] = useState({
    type: 'meeting_notes',
    week: 1,
    title: '',
    content: '',
  });
  
  const signalTypes = [
    { id: 'meeting_notes', label: 'Meeting Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'survey', label: 'Survey Data', icon: <Users className="w-4 h-4" /> },
    { id: 'observation', label: 'Observation', icon: <Eye className="w-4 h-4" /> },
    { id: 'risk_register', label: 'Risk Register', icon: <Shield className="w-4 h-4" /> },
    { id: 'support', label: 'Support Data', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'comms', label: 'Comms/Feedback', icon: <Mail className="w-4 h-4" /> },
  ];
  
  const handleSubmit = () => {
    if (!newSignal.title.trim() || !newSignal.content.trim()) return;
    onAddSignal(newSignal);
    setNewSignal({ type: 'meeting_notes', week: 1, title: '', content: '' });
    setShowAddForm(false);
  };
  
  const typeIcons = Object.fromEntries(signalTypes.map(t => [t.id, t.icon]));
  const typeLabels = Object.fromEntries(signalTypes.map(t => [t.id, t.label]));
  
  return (
    <div className="space-y-6">
      {/* Initiative Settings */}
      <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/50">
        <h3 className="font-semibold text-white mb-4">Initiative Details</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Initiative Name</label>
            <input
              type="text"
              value={initiative.name}
              onChange={(e) => {
                const updated = { ...initiative, name: e.target.value };
                setInitiative(updated);
                storage.set(STORAGE_KEYS.INITIATIVE, updated);
              }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Organisation</label>
            <input
              type="text"
              value={initiative.organisation}
              onChange={(e) => {
                const updated = { ...initiative, organisation: e.target.value };
                setInitiative(updated);
                storage.set(STORAGE_KEYS.INITIATIVE, updated);
              }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Timeline (weeks)</label>
            <input
              type="number"
              value={initiative.timeline}
              onChange={(e) => {
                const updated = { ...initiative, timeline: parseInt(e.target.value) || 12 };
                setInitiative(updated);
                storage.set(STORAGE_KEYS.INITIATIVE, updated);
              }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>
      
      {/* Add Signal Button / Form */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Signal
        </button>
      ) : (
        <div className="p-5 rounded-xl bg-slate-800/30 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Add New Signal</h3>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Signal Type</label>
                <select
                  value={newSignal.type}
                  onChange={(e) => setNewSignal({ ...newSignal, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  {signalTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Week Number</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={newSignal.week}
                  onChange={(e) => setNewSignal({ ...newSignal, week: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Title / Source</label>
              <input
                type="text"
                value={newSignal.title}
                onChange={(e) => setNewSignal({ ...newSignal, title: e.target.value })}
                placeholder="e.g., Steering Committee Week 4, or Finance Team Pulse Survey"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Content</label>
              <textarea
                value={newSignal.content}
                onChange={(e) => setNewSignal({ ...newSignal, content: e.target.value })}
                placeholder="Paste meeting notes, survey comments, observations, or any other signal data..."
                rows={8}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newSignal.title.trim() || !newSignal.content.trim()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Signal
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Signal List */}
      {signals.length > 0 && (
        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800/50">
            <h3 className="font-semibold text-slate-200">Your Signals ({signals.length})</h3>
          </div>
          <div className="divide-y divide-slate-800/30">
            {signals.sort((a, b) => a.week - b.week).map((signal) => (
              <div key={signal.id} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-800/20">
                <div className="p-2 rounded-lg bg-slate-800/50 text-cyan-400">
                  {typeIcons[signal.type] || <FileText className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">
                      {typeLabels[signal.type] || signal.type}
                    </span>
                    <span className="text-xs text-slate-500">Week {signal.week}</span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-200">{signal.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{signal.content}</p>
                </div>
                <button
                  onClick={() => onDeleteSignal(signal.id)}
                  className="p-2 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {signals.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No signals yet. Add meeting notes, survey data, or observations.</p>
        </div>
      )}
    </div>
  );
}

// Weekly Brief View
function WeeklyBriefView({ analysis, initiative, signals }) {
  const [copied, setCopied] = useState(false);
  
  if (!analysis) {
    return (
      <div className="text-center py-16">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">Run analysis first to generate a weekly brief</p>
      </div>
    );
  }
  
  const briefContent = generateBriefMarkdown(analysis, initiative, signals);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(briefContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const blob = new Blob([briefContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `change-brief-${initiative.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Weekly Change Brief</h2>
          <p className="text-sm text-slate-400">Generated from your signals and analysis</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg flex items-center gap-2 text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium rounded-lg flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
      
      <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-6">
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
          {briefContent}
        </pre>
      </div>
    </div>
  );
}

// Generate brief markdown
function generateBriefMarkdown(analysis, initiative, signals) {
  const date = new Date().toLocaleDateString('en-NZ', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let brief = `# Weekly Change Brief
## ${initiative.name}
### ${initiative.organisation}
**Date:** ${date}
**Signals analysed:** ${signals.length}

---

## Executive Summary

`;

  // Risk summary
  if (analysis.risks) {
    const risks = Object.entries(analysis.risks);
    risks.forEach(([key, risk]) => {
      brief += `- **${formatKey(key)}:** ${risk.level} (${risk.score}%) - ${risk.summary}\n`;
    });
  }

  brief += `
---

## Critical Findings

`;

  // Signal clusters
  if (analysis.signalClusters) {
    Object.entries(analysis.signalClusters)
      .filter(([_, cluster]) => cluster.status === 'severe' || cluster.status === 'elevated')
      .forEach(([_, cluster]) => {
        brief += `### ${cluster.label} [${cluster.status.toUpperCase()}]\n\n`;
        brief += `${cluster.interpretation}\n\n`;
        brief += `**Evidence:**\n`;
        cluster.evidence.forEach(e => {
          brief += `- ${e}\n`;
        });
        brief += `\n`;
      });
  }

  brief += `---

## Recommended Interventions

`;

  if (analysis.interventions) {
    analysis.interventions.slice(0, 5).forEach((intervention, i) => {
      brief += `${i + 1}. **${intervention.action}**\n`;
      brief += `   - Timing: ${intervention.timing}\n`;
      brief += `   - Impact: ${intervention.impact}\n\n`;
    });
  }

  brief += `---

## Data Quality

**Confidence level:** ${analysis.confidence || 'Medium'}
**Signals this week:** ${signals.length}
**Gaps:** ${analysis.dataGaps || 'None identified'}

---

*Generated by ChangeOS · Line Of Flight*
`;

  return brief;
}

function formatKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

// Claude API Analysis Function
async function analyseSignals(apiKey, signals, initiative) {
  const signalText = signals.map(s => 
    `[${s.type.toUpperCase()} - Week ${s.week}] ${s.title}\n${s.content}`
  ).join('\n\n---\n\n');
  
  const prompt = `You are ChangeOS, an expert change management analysis system. Analyse the following signals from a change initiative and produce a structured analysis.

INITIATIVE CONTEXT:
- Name: ${initiative.name}
- Organisation: ${initiative.organisation}
- Timeline: ${initiative.timeline} weeks

SIGNALS:
${signalText}

Analyse these signals through the following lenses and produce a JSON response:

1. ADOPTION CLIFF LENS: Predict likelihood of adoption failure. Look for:
   - Training effectiveness gaps (completion vs competence)
   - Manager readiness void
   - Support infrastructure mismatch
   - Resistance patterns being ignored

2. ATTRITION RISK LENS: Predict departure risk. Look for:
   - Burnout indicators
   - Disengagement signals
   - Key person overload
   - Trust erosion

3. TECHNICAL DEBT LENS: Predict permanent workarounds. Look for:
   - "Fix it later" patterns
   - Shadow systems emerging
   - Process bypass signals

For each finding, cite specific evidence from the signals.

Respond with valid JSON in this exact structure:
{
  "lastRun": "${new Date().toISOString()}",
  "confidence": "HIGH/MEDIUM/LOW",
  "dataGaps": "description of what data is missing",
  "risks": {
    "adoptionCliff": {
      "level": "CRITICAL/HIGH/MEDIUM/LOW",
      "score": 0-100,
      "trend": "declining/stable/improving",
      "summary": "one sentence summary"
    },
    "attritionRisk": {
      "level": "CRITICAL/HIGH/MEDIUM/LOW", 
      "score": 0-100,
      "trend": "declining/stable/improving",
      "summary": "one sentence summary"
    },
    "technicalDebt": {
      "level": "CRITICAL/HIGH/MEDIUM/LOW",
      "score": 0-100,
      "trend": "declining/stable/improving",
      "summary": "one sentence summary"
    }
  },
  "interventionWindow": {
    "weeksRemaining": number,
    "status": "OPEN/CLOSING/CLOSED",
    "message": "description of intervention window",
    "originalWindow": number
  },
  "signalClusters": {
    "cluster1": {
      "status": "severe/elevated/normal",
      "score": 0-100,
      "label": "Cluster Name",
      "evidence": ["evidence 1", "evidence 2"],
      "interpretation": "what this means"
    }
  },
  "interventions": [
    {
      "priority": 1,
      "action": "specific action",
      "timing": "when this should happen",
      "cost": "estimated cost/effort",
      "impact": "expected impact",
      "status": "recommended"
    }
  ],
  "recentSignals": [
    {
      "week": number,
      "severity": "critical/warning/info",
      "signal": "description",
      "source": "source name"
    }
  ],
  "sayDoGap": [
    {
      "said": "what was officially said",
      "reality": "what evidence shows",
      "week": number,
      "source": "source"
    }
  ],
  "keyQuotes": [
    {
      "quote": "direct quote from signals",
      "speaker": "who said it",
      "week": number,
      "context": "context"
    }
  ]
}

Be specific. Cite evidence. If data is insufficient for confident claims, say so and rate confidence accordingly.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content[0]?.text;
  
  // Extract JSON from response (handle potential markdown wrapping)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse analysis response');
  }
  
  return JSON.parse(jsonMatch[0]);
}

// ============================================
// EXISTING COMPONENTS (preserved from original)
// ============================================

function NavBar({ onNavigate, currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20"><Compass className="w-5 h-5 text-white" /></div>
            <div><div className="font-[Sora] font-bold text-lg tracking-tight text-white">Line Of Flight</div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Change Intelligence</div></div>
          </button>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('landing')} className={`text-sm transition-colors ${currentPage === 'landing' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>Home</button>
            <button onClick={() => onNavigate('demo')} className={`text-sm transition-colors ${currentPage === 'demo' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>ChangeOS</button>
            <button onClick={() => onNavigate('tools')} className={`text-sm transition-colors ${currentPage === 'tools' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>Tools</button>
            <button onClick={() => onNavigate('knowledge')} className={`text-sm transition-colors ${currentPage === 'knowledge' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>Knowledge</button>
          </div>
          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
        {mobileMenuOpen && (<div className="md:hidden pt-4 pb-2 space-y-2"><button onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-400 hover:text-white">Home</button><button onClick={() => { onNavigate('demo'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-400 hover:text-white">ChangeOS</button><button onClick={() => { onNavigate('tools'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-400 hover:text-white">Tools</button><button onClick={() => { onNavigate('knowledge'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-400 hover:text-white">Knowledge</button></div>)}
      </div>
    </nav>
  );
}

function Footer() {
  return (<footer className="border-t border-slate-800/50 py-12"><div className="max-w-6xl mx-auto px-6"><div className="flex flex-col md:flex-row items-center justify-between gap-6"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div><span className="font-[Sora] font-semibold text-white">Line Of Flight</span></div><div className="text-sm text-slate-500">© 2025 Line Of Flight · Change Intelligence · Aotearoa New Zealand</div></div></div></footer>);
}

function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="landing" />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-20"><div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 mb-8"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span className="text-sm text-slate-300">Change Intelligence Platform</span></div>
          <h1 className="font-[Sora] text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">See what's <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">actually happening</span> in your change initiative</h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">Traditional change management tracks activities while initiatives fail. Line Of Flight provides predictive intelligence, practical tools, and proven frameworks to navigate transformation successfully.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('demo')} className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-lg rounded-xl transition-all hover:shadow-xl hover:shadow-cyan-500/25 flex items-center gap-2">Explore ChangeOS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
            <button onClick={() => onNavigate('tools')} className="px-8 py-4 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-medium rounded-xl transition-all">Browse Tools</button>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronDown className="w-6 h-6 text-slate-500" /></div>
        </div>
      </section>
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16"><div className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">The Platform</div><h2 className="font-[Sora] text-3xl md:text-4xl font-bold text-white mb-4">Everything you need for successful change</h2><p className="text-lg text-slate-400 max-w-2xl mx-auto">From predictive sensing to practical tools to deep knowledge — an integrated platform for change intelligence.</p></div>
          <div className="grid md:grid-cols-3 gap-6">
            <button onClick={() => onNavigate('demo')} className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all text-left"><div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Radio className="w-7 h-7 text-white" /></div><h3 className="font-[Sora] text-xl font-bold text-white mb-3">ChangeOS</h3><p className="text-slate-400 mb-4">Real-time sensing platform that analyses change data through predictive lenses to surface risks before they become failures.</p><div className="flex items-center gap-2 text-cyan-400 text-sm font-medium"><span>Explore demo</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div></button>
            <button onClick={() => onNavigate('tools')} className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all text-left"><div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Wrench className="w-7 h-7 text-white" /></div><h3 className="font-[Sora] text-xl font-bold text-white mb-3">Tools</h3><p className="text-slate-400 mb-4">Interactive calculators and assessments for readiness, stakeholder mapping, impact analysis, and resistance diagnosis.</p><div className="flex items-center gap-2 text-cyan-400 text-sm font-medium"><span>Browse tools</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div></button>
            <button onClick={() => onNavigate('knowledge')} className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all text-left"><div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><BookOpen className="w-7 h-7 text-white" /></div><h3 className="font-[Sora] text-xl font-bold text-white mb-3">Knowledge</h3><p className="text-slate-400 mb-4">Framework library, methodologies, templates, and insights including Te Ao Māori perspectives on change.</p><div className="flex items-center gap-2 text-cyan-400 text-sm font-medium"><span>Explore knowledge</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div></button>
          </div>
        </div>
      </section>
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div><div className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">The Problem</div><h2 className="font-[Sora] text-3xl md:text-4xl font-bold text-white mb-6">Change management is flying blind</h2><div className="space-y-4 text-slate-400"><p>The industry's dirty secret: most change management is activity tracking disguised as insight. Training completions. Comms sent. Boxes ticked.</p><p>Meanwhile, the real signals — eroding confidence, manager confusion, shadow workarounds — go undetected until it's too late.</p></div></div>
            <div className="grid grid-cols-2 gap-4">{[{ label: 'Training completed', value: '78%', subtext: 'feel prepared', subvalue: '22%' },{ label: 'Comms sent', value: '24', subtext: 'actually read', subvalue: '31%' },{ label: 'Risk status', value: 'GREEN', subtext: 'actual risk', subvalue: 'CRITICAL' },{ label: 'Go-live ready', value: 'YES', subtext: 'staff confident', subvalue: '15%' }].map((stat, i) => (<div key={i} className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"><div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{stat.label}</div><div className="text-2xl font-bold text-emerald-400 mb-3">{stat.value}</div><div className="pt-3 border-t border-slate-700/50"><div className="text-xs text-slate-500 mb-1">{stat.subtext}</div><div className="text-lg font-bold text-rose-400">{stat.subvalue}</div></div></div>))}</div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12"><div className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">The Creator</div><h2 className="font-[Sora] text-3xl md:text-4xl font-bold text-white mb-4">Jonathon Kelso</h2><p className="text-lg text-slate-400">Change practitioner, researcher, and builder</p></div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">{[{ label: 'Experience', value: '15+ years', detail: 'NZ public sector & cultural institutions' },{ label: 'Qualification', value: "Master's Degree", detail: 'Change & Organisational Resilience' },{ label: 'Focus', value: 'AI + Change', detail: 'Technology-enabled transformation' }].map((stat, i) => (<div key={i} className="text-center p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{stat.label}</div><div className="text-xl font-bold text-white mb-1">{stat.value}</div><div className="text-sm text-slate-400">{stat.detail}</div></div>))}</div>
          <div className="text-center text-slate-400"><p>Background spans Te Papa, Auckland Museum, Creative New Zealand, and local government.</p></div>
        </div>
      </section>
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-[Sora] text-3xl md:text-4xl font-bold text-white mb-4">Let's connect</h2>
          <p className="text-lg text-slate-400 mb-8">Interested in change intelligence, AI-augmented transformation, or just want to talk shop?</p>
          <div className="flex items-center justify-center gap-4">
            <a href="mailto:hello@lineofflight.co.nz" className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors text-slate-300 hover:text-white"><Mail className="w-5 h-5" /><span>Email</span></a>
            <a href="https://linkedin.com/in/jonathonkelso" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors text-slate-300 hover:text-white"><Linkedin className="w-5 h-5" /><span>LinkedIn</span></a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function ToolsPage({ currentTool, onNavigate }) {
  const tools = [{ id: 'readiness', name: 'Readiness Calculator', description: 'Assess organisational readiness across 8 dimensions', icon: <Calculator className="w-6 h-6" />, color: 'cyan' },{ id: 'stakeholder', name: 'Stakeholder Mapper', description: 'Plot influence vs support for engagement strategies', icon: <Map className="w-6 h-6" />, color: 'emerald' },{ id: 'impact', name: 'Impact Assessment', description: 'Analyse who is affected and what support they need', icon: <Target className="w-6 h-6" />, color: 'amber' },{ id: 'resistance', name: 'Resistance Decoder', description: 'Diagnose what is driving resistance behaviour', icon: <Brain className="w-6 h-6" />, color: 'rose' },{ id: 'myth', name: '70% Myth Debunker', description: 'The story behind the famous change statistic', icon: <HelpCircle className="w-6 h-6" />, color: 'orange' }];
  if (currentTool === 'readiness') return <ReadinessCalculator onNavigate={onNavigate} />;
  if (currentTool === 'stakeholder') return <StakeholderMapper onNavigate={onNavigate} />;
  if (currentTool === 'impact') return <ImpactAssessment onNavigate={onNavigate} />;
  if (currentTool === 'resistance') return <ResistanceDecoder onNavigate={onNavigate} />;
  if (currentTool === 'myth') return <MythDebunker onNavigate={onNavigate} />;
  const colorMap = { cyan: 'from-cyan-500 to-cyan-600', emerald: 'from-emerald-500 to-emerald-600', amber: 'from-amber-500 to-amber-600', rose: 'from-rose-500 to-rose-600', orange: 'from-orange-500 to-orange-600' };
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="tools" />
      <main className="pt-24 pb-16"><div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16"><div className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">Tools</div><h1 className="font-[Sora] text-4xl md:text-5xl font-bold text-white mb-4">Change Management Toolkit</h1><p className="text-lg text-slate-400 max-w-2xl mx-auto">Interactive tools for assessment, planning, and diagnosis.</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{tools.map((tool) => (<button key={tool.id} onClick={() => onNavigate('tools', tool.id)} className="group p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 text-left hover:border-cyan-500/50 hover:bg-slate-800/50 cursor-pointer transition-all"><div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[tool.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>{tool.icon}</div><h3 className="font-semibold text-white mb-2">{tool.name}</h3><p className="text-sm text-slate-400">{tool.description}</p><div className="flex items-center gap-1 mt-4 text-cyan-400 text-sm font-medium"><span>Open tool</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div></button>))}</div>
      </div></main>
      <Footer />
    </div>
  );
}

function ReadinessCalculator({ onNavigate }) {
  const [scores, setScores] = useState({ leadership: 3, capacity: 3, culture: 3, communication: 3, training: 3, systems: 3, stakeholders: 3, history: 3 });
  const [showResults, setShowResults] = useState(false);
  const dimensions = [{ key: 'leadership', label: 'Leadership Alignment', description: 'Are leaders visibly committed?' },{ key: 'capacity', label: 'Change Capacity', description: 'Does the org have bandwidth?' },{ key: 'culture', label: 'Cultural Readiness', description: 'Is culture receptive to change?' },{ key: 'communication', label: 'Communication', description: 'Are there effective channels?' },{ key: 'training', label: 'Training Capability', description: 'Can org build new skills?' },{ key: 'systems', label: 'Systems & Processes', description: 'Are systems ready?' },{ key: 'stakeholders', label: 'Stakeholder Support', description: 'Are stakeholders supportive?' },{ key: 'history', label: 'Change History', description: 'Has org managed change before?' }];
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const percentage = Math.round((totalScore / 40) * 100);
  const getReadinessLevel = () => { if (percentage >= 80) return { level: 'High', color: 'emerald', message: 'Strong foundation' }; if (percentage >= 60) return { level: 'Moderate', color: 'amber', message: 'Some areas need attention' }; if (percentage >= 40) return { level: 'Low', color: 'orange', message: 'Significant prep required' }; return { level: 'Critical', color: 'rose', message: 'Major gaps to address' }; };
  const readiness = getReadinessLevel();
  const radarData = dimensions.map(d => ({ dimension: d.label.split(' ')[0], score: scores[d.key], fullMark: 5 }));
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="tools" />
      <main className="pt-24 pb-16"><div className="max-w-4xl mx-auto px-6">
        <button onClick={() => onNavigate('tools')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /><span>Back to Tools</span></button>
        <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center"><Calculator className="w-6 h-6 text-white" /></div><div><h1 className="font-[Sora] text-2xl font-bold text-white">Readiness Calculator</h1><p className="text-slate-400">Assess organisational readiness</p></div></div>
        {!showResults ? (
          <div className="space-y-6">
            {dimensions.map((dim) => (<div key={dim.key} className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/50"><div className="flex items-start justify-between mb-3"><div><h3 className="font-semibold text-white">{dim.label}</h3><p className="text-sm text-slate-400">{dim.description}</p></div><div className="text-2xl font-bold text-cyan-400">{scores[dim.key]}</div></div><input type="range" min="1" max="5" value={scores[dim.key]} onChange={(e) => setScores({ ...scores, [dim.key]: parseInt(e.target.value) })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" /><div className="flex justify-between mt-2 text-xs text-slate-500"><span>Not ready</span><span>Somewhat</span><span>Ready</span></div></div>))}
            <button onClick={() => setShowResults(true)} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl">Calculate Readiness</button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 text-center"><div className="text-6xl font-bold text-white mb-2">{percentage}%</div><div className={`text-xl font-semibold text-${readiness.color}-400 mb-2`}>{readiness.level} Readiness</div><p className="text-slate-400">{readiness.message}</p></div>
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h3 className="font-semibold text-white mb-4">Readiness Profile</h3><div className="h-80"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarData}><PolarGrid stroke="#334155" /><PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 12 }} /><PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#64748b' }} /><Radar name="Readiness" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} /></RadarChart></ResponsiveContainer></div></div>
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h3 className="font-semibold text-white mb-4">Recommendations</h3><div className="space-y-3">{dimensions.filter(dim => scores[dim.key] <= 2).map((dim) => (<div key={dim.key} className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20"><AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /><div><div className="font-medium text-white">{dim.label}: Critical Gap</div><div className="text-sm text-slate-400">Address before proceeding</div></div></div>))}{dimensions.filter(dim => scores[dim.key] === 3).map((dim) => (<div key={dim.key} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"><Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /><div><div className="font-medium text-white">{dim.label}: Needs Attention</div><div className="text-sm text-slate-400">Develop a plan to strengthen</div></div></div>))}</div></div>
            <button onClick={() => setShowResults(false)} className="w-full py-3 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl">Recalculate</button>
          </div>
        )}
      </div></main>
      <Footer />
    </div>
  );
}

function StakeholderMapper({ onNavigate }) {
  const [stakeholders, setStakeholders] = useState([{ id: 1, name: 'Executive Sponsor', influence: 5, support: 4 },{ id: 2, name: 'IT Director', influence: 4, support: 3 },{ id: 3, name: 'Finance Team Lead', influence: 3, support: 2 },{ id: 4, name: 'End Users', influence: 2, support: 3 }]);
  const [newName, setNewName] = useState('');
  const addStakeholder = () => { if (newName.trim()) { setStakeholders([...stakeholders, { id: Date.now(), name: newName.trim(), influence: 3, support: 3 }]); setNewName(''); } };
  const updateStakeholder = (id, field, value) => { setStakeholders(stakeholders.map(s => s.id === id ? { ...s, [field]: value } : s)); };
  const removeStakeholder = (id) => { setStakeholders(stakeholders.filter(s => s.id !== id)); };
  const getQuadrant = (influence, support) => { if (influence >= 3 && support >= 3) return { name: 'Champions', strategy: 'Engage and empower', color: 'emerald' }; if (influence >= 3 && support < 3) return { name: 'Key Players', strategy: 'Focus attention here', color: 'amber' }; if (influence < 3 && support >= 3) return { name: 'Supporters', strategy: 'Keep informed', color: 'cyan' }; return { name: 'Observers', strategy: 'Monitor', color: 'slate' }; };
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="tools" />
      <main className="pt-24 pb-16"><div className="max-w-6xl mx-auto px-6">
        <button onClick={() => onNavigate('tools')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /><span>Back to Tools</span></button>
        <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center"><Map className="w-6 h-6 text-white" /></div><div><h1 className="font-[Sora] text-2xl font-bold text-white">Stakeholder Mapper</h1><p className="text-slate-400">Plot influence vs support</p></div></div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-2"><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addStakeholder()} placeholder="Add stakeholder name..." className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" /><button onClick={addStakeholder} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium rounded-lg">Add</button></div>
            {stakeholders.map((s) => { const quadrant = getQuadrant(s.influence, s.support); return (
              <div key={s.id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3"><span className="font-medium text-white">{s.name}</span><button onClick={() => removeStakeholder(s.id)} className="text-slate-500 hover:text-rose-400"><X className="w-4 h-4" /></button></div>
                <div className="space-y-3"><div><div className="flex justify-between text-sm text-slate-400 mb-1"><span>Influence</span><span>{s.influence}/5</span></div><input type="range" min="1" max="5" value={s.influence} onChange={(e) => updateStakeholder(s.id, 'influence', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" /></div><div><div className="flex justify-between text-sm text-slate-400 mb-1"><span>Support</span><span>{s.support}/5</span></div><input type="range" min="1" max="5" value={s.support} onChange={(e) => updateStakeholder(s.id, 'support', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" /></div></div>
                <div className={`mt-3 text-sm text-${quadrant.color}-400`}>{quadrant.name}: {quadrant.strategy}</div>
              </div>
            ); })}
          </div>
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">Stakeholder Map</h3>
            <div className="relative aspect-square bg-slate-900/50 rounded-lg border border-slate-700/50">
              <div className="absolute top-2 left-2 text-xs text-amber-400">Key Players</div><div className="absolute top-2 right-2 text-xs text-emerald-400">Champions</div><div className="absolute bottom-2 left-2 text-xs text-slate-400">Observers</div><div className="absolute bottom-2 right-2 text-xs text-cyan-400">Supporters</div>
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-700"></div><div className="absolute left-0 right-0 top-1/2 h-px bg-slate-700"></div>
              {stakeholders.map((s) => { const x = ((s.support - 1) / 4) * 100; const y = 100 - ((s.influence - 1) / 4) * 100; const quadrant = getQuadrant(s.influence, s.support); return (<div key={s.id} className={`absolute w-4 h-4 rounded-full bg-${quadrant.color}-500 border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group`} style={{ left: `${x}%`, top: `${y}%` }}><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100">{s.name}</div></div>); })}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3"><div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"><div className="font-medium text-emerald-400 text-sm">Champions</div><div className="text-xs text-slate-400">High influence, high support</div></div><div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"><div className="font-medium text-amber-400 text-sm">Key Players</div><div className="text-xs text-slate-400">High influence, low support</div></div><div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20"><div className="font-medium text-cyan-400 text-sm">Supporters</div><div className="text-xs text-slate-400">Low influence, high support</div></div><div className="p-3 rounded-lg bg-slate-500/10 border border-slate-500/20"><div className="font-medium text-slate-400 text-sm">Observers</div><div className="text-xs text-slate-400">Low influence, low support</div></div></div>
          </div>
        </div>
      </div></main>
      <Footer />
    </div>
  );
}

function ImpactAssessment({ onNavigate }) {
  const [groups, setGroups] = useState([{ id: 1, name: 'Finance Team', size: 35, processChange: 4, systemChange: 5, roleChange: 3 },{ id: 2, name: 'Department Managers', size: 45, processChange: 3, systemChange: 3, roleChange: 2 }]);
  const [newGroup, setNewGroup] = useState('');
  const addGroup = () => { if (newGroup.trim()) { setGroups([...groups, { id: Date.now(), name: newGroup.trim(), size: 10, processChange: 3, systemChange: 3, roleChange: 3 }]); setNewGroup(''); } };
  const updateGroup = (id, field, value) => { setGroups(groups.map(g => g.id === id ? { ...g, [field]: value } : g)); };
  const removeGroup = (id) => { setGroups(groups.filter(g => g.id !== id)); };
  const getImpactLevel = (g) => { const avg = (g.processChange + g.systemChange + g.roleChange) / 3; if (avg >= 4) return { level: 'High', color: 'rose' }; if (avg >= 2.5) return { level: 'Medium', color: 'amber' }; return { level: 'Low', color: 'emerald' }; };
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="tools" />
      <main className="pt-24 pb-16"><div className="max-w-4xl mx-auto px-6">
        <button onClick={() => onNavigate('tools')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /><span>Back to Tools</span></button>
        <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center"><Target className="w-6 h-6 text-white" /></div><div><h1 className="font-[Sora] text-2xl font-bold text-white">Impact Assessment</h1><p className="text-slate-400">Analyse change impact across groups</p></div></div>
        <div className="space-y-6">
          <div className="flex gap-2"><input type="text" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addGroup()} placeholder="Add impacted group..." className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" /><button onClick={addGroup} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium rounded-lg">Add Group</button></div>
          {groups.map((g) => { const impact = getImpactLevel(g); return (
            <div key={g.id} className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><h3 className="font-semibold text-white">{g.name}</h3><span className={`text-xs px-2 py-1 rounded bg-${impact.color}-500/20 text-${impact.color}-400`}>{impact.level} Impact</span></div><button onClick={() => removeGroup(g.id)} className="text-slate-500 hover:text-rose-400"><X className="w-4 h-4" /></button></div>
              <div className="grid md:grid-cols-2 gap-4 mb-4"><div><label className="block text-sm text-slate-400 mb-1">Group Size</label><input type="number" value={g.size} onChange={(e) => updateGroup(g.id, 'size', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500" /></div></div>
              <div className="space-y-4">{[{ key: 'processChange', label: 'Process Change' },{ key: 'systemChange', label: 'System Change' },{ key: 'roleChange', label: 'Role Change' }].map((item) => (<div key={item.key}><div className="flex justify-between text-sm mb-1"><span className="text-slate-300">{item.label}</span><span className="text-slate-500">{g[item.key]}/5</span></div><input type="range" min="1" max="5" value={g[item.key]} onChange={(e) => updateGroup(g.id, item.key, parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" /></div>))}</div>
            </div>
          ); })}
          {groups.length > 0 && (<div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h3 className="font-semibold text-white mb-4">Impact Summary</h3><div className="space-y-2">{groups.map((g) => { const impact = getImpactLevel(g); const totalImpact = g.processChange + g.systemChange + g.roleChange; return (<div key={g.id} className="flex items-center gap-4"><div className="w-40 text-sm text-slate-400">{g.name}</div><div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full bg-${impact.color}-500 rounded-full`} style={{ width: `${(totalImpact / 15) * 100}%` }}></div></div><div className="w-20 text-right text-sm text-slate-400">{g.size} people</div></div>); })}</div><div className="mt-4 pt-4 border-t border-slate-700/50 text-sm text-slate-400">Total affected: {groups.reduce((sum, g) => sum + g.size, 0)} people across {groups.length} groups</div></div>)}
        </div>
      </div></main>
      <Footer />
    </div>
  );
}

function ResistanceDecoder({ onNavigate }) {
  const [behaviours, setBehaviours] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const behaviourOptions = [{ id: 'questions', label: 'Asking lots of questions', category: 'fear' },{ id: 'history', label: 'Referencing past failures', category: 'trust' },{ id: 'workload', label: 'Citing workload concerns', category: 'capacity' },{ id: 'expertise', label: 'Questioning their relevance', category: 'loss' },{ id: 'silence', label: 'Going quiet in meetings', category: 'fear' },{ id: 'workarounds', label: 'Creating workarounds', category: 'capacity' },{ id: 'delegation', label: 'Delegating change tasks', category: 'loss' },{ id: 'criticism', label: 'Criticising publicly', category: 'trust' },{ id: 'compliance', label: 'Malicious compliance', category: 'trust' },{ id: 'delays', label: 'Requesting delays', category: 'fear' },{ id: 'alternatives', label: 'Proposing alternatives', category: 'trust' },{ id: 'absenteeism', label: 'Missing meetings', category: 'capacity' }];
  const categories = { fear: { name: 'Fear of the Unknown', color: 'amber', description: 'Uncertainty about what the change means', strategies: ['Provide clear, specific information', 'Create safe spaces for questions', 'Share stories from similar changes', 'Be honest about unknowns'] }, loss: { name: 'Perceived Loss', color: 'rose', description: 'Feeling they are losing status or expertise', strategies: ['Acknowledge their expertise', 'Leverage their knowledge', 'Clarify what is preserved', 'Create roles that honour contribution'] }, capacity: { name: 'Capacity Constraints', color: 'cyan', description: 'Genuinely overwhelmed', strategies: ['Review actual workload', 'Identify what can pause', 'Provide additional support', 'Adjust timelines if needed'] }, trust: { name: 'Trust Deficit', color: 'violet', description: 'Past experience taught skepticism', strategies: ['Acknowledge past failures', 'Explain what is different', 'Involve in decisions', 'Follow through on commitments'] } };
  const toggleBehaviour = (id) => { setBehaviours(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]); };
  const getAnalysis = () => { const counts = { fear: 0, loss: 0, capacity: 0, trust: 0 }; behaviours.forEach(id => { const behaviour = behaviourOptions.find(b => b.id === id); if (behaviour) counts[behaviour.category]++; }); return Object.entries(counts).map(([key, count]) => ({ ...categories[key], key, count })).sort((a, b) => b.count - a.count); };
  const analysis = getAnalysis();
  const primaryDriver = analysis[0];
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="tools" />
      <main className="pt-24 pb-16"><div className="max-w-4xl mx-auto px-6">
        <button onClick={() => onNavigate('tools')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /><span>Back to Tools</span></button>
        <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center"><Brain className="w-6 h-6 text-white" /></div><div><h1 className="font-[Sora] text-2xl font-bold text-white">Resistance Decoder</h1><p className="text-slate-400">Understand what drives resistance</p></div></div>
        {!showAnalysis ? (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h3 className="font-semibold text-white mb-2">What behaviours are you observing?</h3><p className="text-sm text-slate-400 mb-4">Select all that apply</p><div className="grid md:grid-cols-2 gap-3">{behaviourOptions.map((b) => (<button key={b.id} onClick={() => toggleBehaviour(b.id)} className={`p-3 rounded-lg border text-left transition-all ${behaviours.includes(b.id) ? 'bg-cyan-500/20 border-cyan-500/50 text-white' : 'bg-slate-800/30 border-slate-700/50 text-slate-300 hover:border-slate-600'}`}><div className="flex items-center gap-2"><div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${behaviours.includes(b.id) ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600'}`}>{behaviours.includes(b.id) && <Check className="w-3 h-3 text-white" />}</div><span className="text-sm">{b.label}</span></div></button>))}</div></div>
            <button onClick={() => setShowAnalysis(true)} disabled={behaviours.length === 0} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">Decode Resistance</button>
          </div>
        ) : (
          <div className="space-y-6">
            {primaryDriver && primaryDriver.count > 0 && (<div className={`p-6 rounded-xl bg-${primaryDriver.color}-500/10 border border-${primaryDriver.color}-500/30`}><div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Primary Driver</div><h2 className={`text-2xl font-bold text-${primaryDriver.color}-400 mb-2`}>{primaryDriver.name}</h2><p className="text-slate-300">{primaryDriver.description}</p></div>)}
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h3 className="font-semibold text-white mb-4">Driver Analysis</h3><div className="space-y-3">{analysis.map((driver) => (<div key={driver.key}><div className="flex items-center justify-between mb-1"><span className={`text-sm text-${driver.color}-400`}>{driver.name}</span><span className="text-sm text-slate-500">{driver.count} signals</span></div><div className="h-2 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full bg-${driver.color}-500 rounded-full`} style={{ width: `${Math.max((driver.count / behaviours.length) * 100, 5)}%` }}></div></div></div>))}</div></div>
            {primaryDriver && primaryDriver.count > 0 && (<div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h3 className="font-semibold text-white mb-4">Recommended Strategies</h3><div className="space-y-3">{primaryDriver.strategies.map((strategy, i) => (<div key={i} className="flex items-start gap-3"><div className={`w-6 h-6 rounded-full bg-${primaryDriver.color}-500/20 flex items-center justify-center shrink-0`}><span className={`text-xs font-semibold text-${primaryDriver.color}-400`}>{i + 1}</span></div><p className="text-slate-300">{strategy}</p></div>))}</div></div>)}
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30"><div className="flex items-start gap-3"><Lightbulb className="w-6 h-6 text-emerald-400 shrink-0" /><div><h3 className="font-semibold text-white mb-2">Remember</h3><p className="text-slate-300 text-sm">Resistance is information, not obstruction. These behaviours tell you what people need to navigate this change. Listen to them.</p></div></div></div>
            <button onClick={() => { setShowAnalysis(false); setBehaviours([]); }} className="w-full py-3 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl">Start Over</button>
          </div>
        )}
      </div></main>
      <Footer />
    </div>
  );
}

function MythDebunker({ onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [{ title: "The 70% Myth", content: "You've heard it: '70% of change initiatives fail.' It's cited everywhere.", highlight: "70%", highlightLabel: "of changes fail" },{ title: "But where does it come from?", content: "It traces back to a 1993 book. They didn't cite a source. They estimated.", highlight: "1993", highlightLabel: "Origin year" },{ title: "It's been passed around ever since", content: "Researchers tried to verify it. They can't. The citation chain leads nowhere.", highlight: "0", highlightLabel: "Studies confirming it" },{ title: "What we actually know", content: "Change success is contextual. A single statistic can't capture this complexity.", highlight: "∞", highlightLabel: "Variables at play" },{ title: "Why does the myth persist?", content: "It's useful. For consultants, urgency. For change managers, justification. But useful isn't true.", highlight: "💰", highlightLabel: "Follow the incentives" },{ title: "What to do instead", content: "Focus on your specific context. Your organisation's history is more predictive.", highlight: "📊", highlightLabel: "Use real data" },{ title: "The real question", content: "Instead of 'will we be in the 70%?' ask: 'What would make this succeed or fail here?'", highlight: "?", highlightLabel: "Ask better questions" }];
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="tools" />
      <main className="pt-24 pb-16"><div className="max-w-4xl mx-auto px-6">
        <button onClick={() => onNavigate('tools')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /><span>Back to Tools</span></button>
        <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center"><HelpCircle className="w-6 h-6 text-white" /></div><div><h1 className="font-[Sora] text-2xl font-bold text-white">The 70% Myth Debunker</h1><p className="text-slate-400">The story behind the famous statistic</p></div></div>
        <div className="p-8 md:p-12 rounded-2xl bg-slate-800/30 border border-slate-700/50 min-h-[400px] flex flex-col justify-center"><div className="text-center"><div className="text-6xl md:text-8xl font-bold text-cyan-400 mb-4">{slides[currentSlide].highlight}</div><div className="text-sm text-slate-500 uppercase tracking-wider mb-8">{slides[currentSlide].highlightLabel}</div><h2 className="font-[Sora] text-2xl md:text-3xl font-bold text-white mb-4">{slides[currentSlide].title}</h2><p className="text-lg text-slate-400 max-w-2xl mx-auto">{slides[currentSlide].content}</p></div></div>
        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30"><ChevronLeft className="w-5 h-5" /><span>Previous</span></button>
          <div className="flex items-center gap-2">{slides.map((_, i) => (<button key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-cyan-400 w-6' : 'bg-slate-600 hover:bg-slate-500'}`} />))}</div>
          <button onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={currentSlide === slides.length - 1} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30"><span>Next</span><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="mt-12 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"><p className="text-sm text-slate-500"><strong className="text-slate-400">Further reading:</strong> Hughes, M. (2011). "Do 70 Per Cent of All Organizational Change Initiatives Really Fail?" Journal of Change Management, 11(4), 451-464.</p></div>
      </div></main>
      <Footer />
    </div>
  );
}

function KnowledgePage({ currentKnowledge, onNavigate }) {
  const sections = [{ id: 'frameworks', name: 'Framework Library', description: 'ADKAR, Kotter, Bridges — explained and critiqued', icon: <Layers className="w-6 h-6" />, color: 'cyan' },{ id: 'methodologies', name: 'Line Of Flight Methodologies', description: 'ACCEPTANCE framework and AI-augmented change', icon: <Compass className="w-6 h-6" />, color: 'emerald' },{ id: 'teaomaori', name: 'Te Ao Māori & Change', description: 'Cultural responsiveness in transformation', icon: <Heart className="w-6 h-6" />, color: 'amber' },{ id: 'templates', name: 'Templates & Resources', description: 'Change plans, stakeholder registers, comms', icon: <FileText className="w-6 h-6" />, color: 'violet' }];
  if (currentKnowledge === 'frameworks') return <FrameworksPage onNavigate={onNavigate} />;
  if (currentKnowledge === 'methodologies') return <MethodologiesPage onNavigate={onNavigate} />;
  if (currentKnowledge === 'teaomaori') return <TeAoMaoriPage onNavigate={onNavigate} />;
  if (currentKnowledge === 'templates') return <TemplatesPage onNavigate={onNavigate} />;
  const colorMap = { cyan: 'from-cyan-500 to-cyan-600', emerald: 'from-emerald-500 to-emerald-600', amber: 'from-amber-500 to-amber-600', violet: 'from-violet-500 to-violet-600' };
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="knowledge" />
      <main className="pt-24 pb-16"><div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16"><div className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">Knowledge Base</div><h1 className="font-[Sora] text-4xl md:text-5xl font-bold text-white mb-4">Change Intelligence Library</h1><p className="text-lg text-slate-400 max-w-2xl mx-auto">Frameworks, methodologies, and resources for effective change management.</p></div>
        <div className="grid md:grid-cols-2 gap-6">{sections.map((section) => (<button key={section.id} onClick={() => onNavigate('knowledge', section.id)} className="group p-8 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 transition-all text-left"><div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[section.color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{section.icon}</div><h3 className="font-[Sora] text-xl font-bold text-white mb-2">{section.name}</h3><p className="text-slate-400 mb-4">{section.description}</p><div className="flex items-center gap-2 text-cyan-400 text-sm font-medium"><span>Explore</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div></button>))}</div>
      </div></main>
      <Footer />
    </div>
  );
}

function FrameworksPage({ onNavigate }) {
  const frameworks = [{ name: 'ADKAR', creator: 'Prosci', focus: 'Individual change', stages: ['Awareness', 'Desire', 'Knowledge', 'Ability', 'Reinforcement'], strengths: 'Simple, memorable, human-focused', limitations: 'Can oversimplify, assumes linear progression', bestFor: 'Training-heavy changes' },{ name: "Kotter's 8 Steps", creator: 'John Kotter', focus: 'Organisational transformation', stages: ['Create urgency', 'Build coalition', 'Form vision', 'Communicate', 'Remove obstacles', 'Short-term wins', 'Build on change', 'Anchor in culture'], strengths: 'Comprehensive, addresses leadership', limitations: 'Assumes top-down, sequential rarely matches reality', bestFor: 'Large-scale transformations' },{ name: "Bridges' Transition Model", creator: 'William Bridges', focus: 'Psychological transition', stages: ['Ending', 'Neutral Zone', 'New Beginning'], strengths: 'Acknowledges grief and loss', limitations: 'Less actionable', bestFor: 'Understanding emotional responses' },{ name: "Lewin's Change Model", creator: 'Kurt Lewin', focus: 'Force field analysis', stages: ['Unfreeze', 'Change', 'Refreeze'], strengths: 'Foundational', limitations: 'Too simple for modern complexity', bestFor: 'Teaching basics' }];
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="knowledge" />
      <main className="pt-24 pb-16"><div className="max-w-4xl mx-auto px-6">
        <button onClick={() => onNavigate('knowledge')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /><span>Back to Knowledge</span></button>
        <div className="mb-12"><h1 className="font-[Sora] text-3xl font-bold text-white mb-4">Framework Library</h1><p className="text-slate-400">The major change management frameworks — what they offer and where they fall short.</p></div>
        <div className="space-y-8">{frameworks.map((fw) => (<div key={fw.name} className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><div className="mb-4"><h2 className="font-[Sora] text-xl font-bold text-white">{fw.name}</h2><p className="text-sm text-slate-500">{fw.creator} · {fw.focus}</p></div><div className="flex flex-wrap gap-2 mb-4">{fw.stages.map((stage, i) => (<span key={i} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-full border border-cyan-500/20">{stage}</span>))}</div><div className="grid md:grid-cols-2 gap-4 mt-4"><div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"><div className="text-xs text-emerald-400 uppercase mb-1">Strengths</div><p className="text-sm text-slate-300">{fw.strengths}</p></div><div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20"><div className="text-xs text-rose-400 uppercase mb-1">Limitations</div><p className="text-sm text-slate-300">{fw.limitations}</p></div></div><div className="mt-4 pt-4 border-t border-slate-700/50"><div className="text-xs text-slate-500 uppercase mb-1">Best For</div><p className="text-sm text-slate-300">{fw.bestFor}</p></div></div>))}</div>
        <div className="mt-12 p-6 rounded-xl bg-amber-500/10 border border-amber-500/30"><div className="flex items-start gap-3"><Lightbulb className="w-6 h-6 text-amber-400 shrink-0" /><div><h3 className="font-semibold text-white mb-2">The Line Of Flight View</h3><p className="text-slate-300 text-sm">Frameworks are scaffolding, not reality. The best practitioners know when to follow them and when to read the room instead.</p></div></div></div>
      </div></main>
      <Footer />
    </div>
  );
}

function MethodologiesPage({ onNavigate }) {
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="knowledge" />
      <main className="pt-24 pb-16"><div className="max-w-4xl mx-auto px-6">
        <button onClick={() => onNavigate('knowledge')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /><span>Back to Knowledge</span></button>
        <div className="mb-12"><h1 className="font-[Sora] text-3xl font-bold text-white mb-4">Line Of Flight Methodologies</h1><p className="text-slate-400">Original frameworks developed through research and practice.</p></div>
        <div className="p-8 rounded-xl bg-slate-800/30 border border-slate-700/50 mb-8"><h2 className="font-[Sora] text-2xl font-bold text-white mb-4">The ACCEPTANCE Framework</h2><p className="text-slate-400 mb-6">A methodology for introducing AI into change management practice.</p><div className="space-y-4">{[{ letter: 'A', word: 'Assess', desc: 'Current AI usage and readiness' },{ letter: 'C', word: 'Clarify', desc: 'Ethical boundaries' },{ letter: 'C', word: 'Choose', desc: 'Appropriate tools' },{ letter: 'E', word: 'Experiment', desc: 'Low-risk applications' },{ letter: 'P', word: 'Practice', desc: 'Daily workflows' },{ letter: 'T', word: 'Track', desc: 'Outcomes and adjust' },{ letter: 'A', word: 'Advocate', desc: 'Responsible adoption' },{ letter: 'N', word: 'Navigate', desc: 'Ongoing changes' },{ letter: 'C', word: 'Cultivate', desc: 'Continuous learning' },{ letter: 'E', word: 'Embed', desc: 'AI-augmented practices' }].map((item, i) => (<div key={i} className="flex items-start gap-4"><div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0"><span className="font-bold text-cyan-400">{item.letter}</span></div><div><div className="font-semibold text-white">{item.word}</div><div className="text-sm text-slate-400">{item.desc}</div></div></div>))}</div></div>
        <div className="p-8 rounded-xl bg-slate-800/30 border border-slate-700/50"><h2 className="font-[Sora] text-2xl font-bold text-white mb-4">Curating the Augmented Change Craft</h2><p className="text-slate-400 mb-6">How AI transforms change management — not by replacing judgment, but by amplifying capabilities.</p><div className="grid md:grid-cols-3 gap-4"><div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"><div className="text-cyan-400 font-semibold mb-2">Sensing</div><p className="text-sm text-slate-400">Continuous monitoring at scale</p></div><div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"><div className="text-emerald-400 font-semibold mb-2">Synthesis</div><p className="text-sm text-slate-400">Pattern recognition across data</p></div><div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"><div className="text-amber-400 font-semibold mb-2">Response</div><p className="text-sm text-slate-400">Human judgment remains central</p></div></div></div>
      </div></main>
      <Footer />
    </div>
  );
}

function TeAoMaoriPage({ onNavigate }) {
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="knowledge" />
      <main className="pt-24 pb-16"><div className="max-w-4xl mx-auto px-6">
        <button onClick={() => onNavigate('knowledge')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /><span>Back to Knowledge</span></button>
        <div className="mb-12"><h1 className="font-[Sora] text-3xl font-bold text-white mb-4">Te Ao Māori & Change</h1><p className="text-slate-400">Change in Aotearoa requires cultural responsiveness.</p></div>
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h2 className="font-[Sora] text-xl font-bold text-amber-400 mb-2">Whakawhānaungatanga</h2><p className="text-sm text-slate-500 mb-3">Relationship building</p><p className="text-slate-300">Before diving into change mechanics, invest in relationship. This isn't preliminary — it's foundational.</p></div>
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h2 className="font-[Sora] text-xl font-bold text-amber-400 mb-2">Manaakitanga</h2><p className="text-sm text-slate-500 mb-3">Hospitality, support</p><p className="text-slate-300">How we treat people through change matters as much as the change itself.</p></div>
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h2 className="font-[Sora] text-xl font-bold text-amber-400 mb-2">Kotahitanga</h2><p className="text-sm text-slate-500 mb-3">Unity, collective action</p><p className="text-slate-300">Change succeeds when people move together, not when pushed through alone.</p></div>
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"><h2 className="font-[Sora] text-xl font-bold text-amber-400 mb-2">Kaitiakitanga</h2><p className="text-sm text-slate-500 mb-3">Guardianship</p><p className="text-slate-300">Change leaders as kaitiaki — guardians of people and process.</p></div>
        </div>
        <div className="mt-8 p-6 rounded-xl bg-amber-500/10 border border-amber-500/30"><div className="flex items-start gap-3"><Heart className="w-6 h-6 text-amber-400 shrink-0" /><div><h3 className="font-semibold text-white mb-2">Te Tiriti Considerations</h3><p className="text-slate-300 text-sm">In public sector contexts, change must consider Te Tiriti obligations — genuine partnership, participation, and protection.</p></div></div></div>
      </div></main>
      <Footer />
    </div>
  );
}

function TemplatesPage({ onNavigate }) {
  const templates = [{ name: 'Change Impact Assessment Template', format: 'DOCX' },{ name: 'Stakeholder Register', format: 'XLSX' },{ name: 'Communications Plan', format: 'DOCX' },{ name: 'Readiness Checklist', format: 'PDF' },{ name: 'Change Request Form', format: 'DOCX' },{ name: 'Lessons Learned Template', format: 'DOCX' }];
  return (
    <div className="min-h-screen font-[IBM_Plex_Sans]">
      <NavBar onNavigate={onNavigate} currentPage="knowledge" />
      <main className="pt-24 pb-16"><div className="max-w-4xl mx-auto px-6">
        <button onClick={() => onNavigate('knowledge')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /><span>Back to Knowledge</span></button>
        <div className="mb-12"><h1 className="font-[Sora] text-3xl font-bold text-white mb-4">Templates & Resources</h1><p className="text-slate-400">Practical templates for your change initiatives.</p></div>
        <div className="space-y-4">{templates.map((t, i) => (<div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center"><FileText className="w-5 h-5 text-violet-400" /></div><div className="font-medium text-white">{t.name}</div></div><div className="flex items-center gap-3"><span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded">{t.format}</span><button className="p-2 text-slate-400 hover:text-cyan-400"><Download className="w-5 h-5" /></button></div></div>))}</div>
        <div className="mt-8 p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center"><p className="text-slate-400">Templates coming soon. Use the interactive tools in the meantime.</p></div>
      </div></main>
      <Footer />
    </div>
  );
}

// Dashboard and supporting components
function Dashboard({ analysis, expandedCluster, setExpandedCluster }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskCard title="Adoption Cliff" icon={<TrendingDown className="w-5 h-5" />} risk={analysis.risks.adoptionCliff} color="rose" />
        <RiskCard title="Attrition Risk" icon={<Users className="w-5 h-5" />} risk={analysis.risks.attritionRisk} color="amber" />
        <RiskCard title="Technical Debt" icon={<Wrench className="w-5 h-5" />} risk={analysis.risks.technicalDebt} color="amber" />
      </div>
      <InterventionWindow window={analysis.interventionWindow} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SignalClusters clusters={analysis.signalClusters} expanded={expandedCluster} setExpanded={setExpandedCluster} />
          {analysis.trajectory && <TrajectoryChart trajectory={analysis.trajectory} />}
        </div>
        <div className="space-y-6">
          {analysis.interventions && <Interventions interventions={analysis.interventions} />}
          {analysis.recentSignals && <RecentSignals signals={analysis.recentSignals.slice(0, 6)} />}
        </div>
      </div>
    </div>
  );
}

function RiskCard({ title, icon, risk, color }) {
  const colorMap = { rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' }, amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' }, emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' } };
  const colors = colorMap[color] || colorMap.amber;
  const TrendIcon = risk.trend === 'declining' ? TrendingDown : risk.trend === 'improving' ? TrendingUp : Minus;
  return (<div className={`relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg} p-5`}><div className="flex items-start justify-between mb-4"><div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>{icon}</div><div className={`flex items-center gap-1 text-xs ${colors.text}`}><TrendIcon className="w-3 h-3" /><span className="capitalize">{risk.trend}</span></div></div><div className="space-y-2"><div className="flex items-baseline gap-2"><span className={`text-3xl font-bold ${colors.text}`}>{risk.score}%</span><span className={`text-xs font-semibold px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>{risk.level}</span></div><h3 className="font-semibold text-slate-200">{title}</h3><p className="text-xs text-slate-400">{risk.summary}</p></div></div>);
}

function InterventionWindow({ window }) {
  const isClosed = window.status === 'CLOSED';
  return (<div className={`rounded-xl border p-5 ${isClosed ? 'border-slate-700/50 bg-slate-800/30' : 'border-amber-500/30 bg-amber-500/5'}`}><div className="flex items-center gap-3 mb-4"><div className={`p-2 rounded-lg ${isClosed ? 'bg-slate-700/50 text-slate-400' : 'bg-amber-500/20 text-amber-400'}`}><Clock className="w-5 h-5" /></div><div><h3 className="font-semibold text-slate-200">Intervention Window</h3><p className="text-xs text-slate-400">{window.message}</p></div></div><div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden"><div className={`absolute inset-y-0 left-0 rounded-full ${isClosed ? 'bg-slate-600' : 'bg-amber-500'}`} style={{ width: '100%' }}></div></div><div className="flex justify-between mt-2 text-xs text-slate-500"><span>Week 1</span><span className={isClosed ? 'text-slate-400' : 'text-amber-400'}>{isClosed ? 'Window closed' : `${window.weeksRemaining} weeks remaining`}</span><span>Week 12</span></div></div>);
}

function SignalClusters({ clusters, expanded, setExpanded }) {
  const clusterData = Object.entries(clusters).map(([key, cluster]) => ({ key, ...cluster }));
  const statusColors = { severe: { bar: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10' }, elevated: { bar: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10' }, normal: { bar: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10' } };
  return (<div className="rounded-xl border border-slate-800/50 bg-slate-900/30 overflow-hidden"><div className="px-5 py-4 border-b border-slate-800/50"><h3 className="font-semibold text-slate-200 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" />Signal Clusters</h3></div><div className="divide-y divide-slate-800/50">{clusterData.map((cluster) => { const colors = statusColors[cluster.status] || statusColors.normal; const isExpanded = expanded === cluster.key; return (<div key={cluster.key}><button onClick={() => setExpanded(isExpanded ? null : cluster.key)} className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-800/30"><div className="flex-1"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-slate-300">{cluster.label}</span><span className={`text-xs font-semibold px-2 py-0.5 rounded ${colors.bg} ${colors.text} capitalize`}>{cluster.status}</span></div><div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden"><div className={`absolute inset-y-0 left-0 rounded-full ${colors.bar}`} style={{ width: `${cluster.score}%` }}></div></div></div>{isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}</button>{isExpanded && (<div className="px-5 pb-4"><div className="bg-slate-800/50 rounded-lg p-4 space-y-3"><div><h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Evidence</h4><ul className="space-y-1.5">{cluster.evidence.map((item, i) => (<li key={i} className="text-sm text-slate-300 flex items-start gap-2"><span className="text-cyan-400 mt-1">•</span>{item}</li>))}</ul></div><div className="pt-3 border-t border-slate-700/50"><h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Interpretation</h4><p className="text-sm text-slate-300">{cluster.interpretation}</p></div></div></div>)}</div>); })}</div></div>);
}

function TrajectoryChart({ trajectory }) {
  return (<div className="rounded-xl border border-slate-800/50 bg-slate-900/30 overflow-hidden"><div className="px-5 py-4 border-b border-slate-800/50"><h3 className="font-semibold text-slate-200 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" />Risk Trajectory</h3></div><div className="p-5"><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trajectory}><defs><linearGradient id="adoptionGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient><linearGradient id="attritionGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient><linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="week" stroke="#64748b" fontSize={12} tickFormatter={(v) => `W${v}`} /><YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} /><Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} labelFormatter={(v) => `Week ${v}`} /><Area type="monotone" dataKey="adoptionRisk" stroke="#f43f5e" strokeWidth={2} fill="url(#adoptionGradient)" name="Adoption Risk" /><Area type="monotone" dataKey="attritionRisk" stroke="#f59e0b" strokeWidth={2} fill="url(#attritionGradient)" name="Attrition Risk" /><Area type="monotone" dataKey="technicalDebt" stroke="#06b6d4" strokeWidth={2} fill="url(#debtGradient)" name="Technical Debt" /></AreaChart></ResponsiveContainer></div><div className="flex items-center justify-center gap-6 mt-4"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-xs text-slate-400">Adoption Risk</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-xs text-slate-400">Attrition Risk</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-xs text-slate-400">Technical Debt</span></div></div></div></div>);
}

function Interventions({ interventions }) {
  return (<div className="rounded-xl border border-slate-800/50 bg-slate-900/30 overflow-hidden"><div className="px-5 py-4 border-b border-slate-800/50"><h3 className="font-semibold text-slate-200 flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-400" />Recommended Interventions</h3></div><div className="p-4 space-y-3">{interventions.slice(0, 4).map((item, i) => (<div key={i} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"><div className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-semibold text-slate-400">{item.priority}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-300">{item.action}</p><p className="text-xs text-slate-500 mt-1">{item.timing}</p><div className="flex items-center gap-2 mt-2"><span className={`text-xs px-2 py-0.5 rounded ${item.status === 'missed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>{item.status}</span>{item.cost && <span className="text-xs text-slate-500">{item.cost}</span>}</div></div></div></div>))}</div></div>);
}

function RecentSignals({ signals }) {
  const severityStyles = { critical: { icon: 'text-rose-400', bg: 'bg-rose-500/10' }, warning: { icon: 'text-amber-400', bg: 'bg-amber-500/10' }, info: { icon: 'text-cyan-400', bg: 'bg-cyan-500/10' } };
  return (<div className="rounded-xl border border-slate-800/50 bg-slate-900/30 overflow-hidden"><div className="px-5 py-4 border-b border-slate-800/50"><h3 className="font-semibold text-slate-200 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-cyan-400" />Recent Signals</h3></div><div className="divide-y divide-slate-800/30">{signals.map((signal, i) => { const styles = severityStyles[signal.severity] || severityStyles.info; return (<div key={i} className="px-4 py-3 flex items-start gap-3"><div className={`p-1.5 rounded ${styles.bg}`}><AlertTriangle className={`w-3 h-3 ${styles.icon}`} /></div><div className="flex-1 min-w-0"><p className="text-sm text-slate-300">{signal.signal}</p><div className="flex items-center gap-2 mt-1"><span className="text-xs text-slate-500">Week {signal.week}</span><span className="text-slate-600">·</span><span className="text-xs text-slate-500">{signal.source}</span></div></div></div>); })}</div></div>);
}

function SignalsView({ analysis }) {
  return (<div className="space-y-8"><div className="rounded-xl border border-slate-800/50 bg-slate-900/30 overflow-hidden"><div className="px-5 py-4 border-b border-slate-800/50"><h3 className="font-semibold text-slate-200 flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" />Say/Do Gap Analysis</h3><p className="text-sm text-slate-400 mt-1">Delta between official narrative and ground truth</p></div><div className="divide-y divide-slate-800/30">{(analysis.sayDoGap || []).map((item, i) => (<div key={i} className="p-5"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20"><div className="text-xs font-semibold text-emerald-400 uppercase mb-2">What was said</div><p className="text-sm text-slate-300">"{item.said}"</p></div><div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20"><div className="text-xs font-semibold text-rose-400 uppercase mb-2">What was real</div><p className="text-sm text-slate-300">{item.reality}</p></div></div><div className="flex items-center gap-2 mt-3 text-xs text-slate-500"><span>Week {item.week}</span><span className="text-slate-600">·</span><span>{item.source}</span></div></div>))}</div></div><div className="rounded-xl border border-slate-800/50 bg-slate-900/30 overflow-hidden"><div className="px-5 py-4 border-b border-slate-800/50"><h3 className="font-semibold text-slate-200 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-cyan-400" />Key Quotes</h3></div><div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">{(analysis.keyQuotes || []).map((item, i) => (<div key={i} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30"><blockquote className="text-sm text-slate-300 italic mb-3">"{item.quote}"</blockquote><div className="flex items-center justify-between"><span className="text-xs font-medium text-cyan-400">{item.speaker}</span><span className="text-xs text-slate-500">Week {item.week}</span></div><p className="text-xs text-slate-500 mt-1">{item.context}</p></div>))}</div></div></div>);
}

function InputsView({ inputs }) {
  const typeIcons = { meeting_notes: <FileText className="w-4 h-4" />, survey: <Users className="w-4 h-4" />, observation: <Eye className="w-4 h-4" />, training: <Activity className="w-4 h-4" />, risk_register: <Shield className="w-4 h-4" />, support: <MessageSquare className="w-4 h-4" /> };
  const typeLabels = { meeting_notes: 'Meeting Notes', survey: 'Survey Data', observation: 'Observation', training: 'Training Metrics', risk_register: 'Risk Register', support: 'Support Data' };
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold text-slate-200">Data Inputs</h2><p className="text-sm text-slate-400 mt-1">{inputs.length} inputs across 12 weeks</p></div></div><div className="rounded-xl border border-slate-800/50 bg-slate-900/30 overflow-hidden"><div className="divide-y divide-slate-800/30">{inputs.map((input) => (<div key={input.id} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-800/20"><div className="p-2 rounded-lg bg-slate-800/50 text-cyan-400">{typeIcons[input.type]}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">{typeLabels[input.type]}</span><span className="text-xs text-slate-500">Week {input.week}</span></div><h3 className="text-sm font-medium text-slate-200">{input.title}</h3><p className="text-sm text-slate-400 mt-1">{input.summary}</p></div><div className="text-xs text-slate-500">{new Date(input.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}</div></div>))}</div></div><div className="text-center py-8"><p className="text-sm text-slate-500">Demo mode: Switch to Live mode to add your own signals.</p></div></div>);
}

export default App;
