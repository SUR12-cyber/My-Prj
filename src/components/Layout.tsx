import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../hooks/useSimulatedTelemetry';
import { playSynthSound, getMuted, setMuted } from '../utils/sound';
import {
  LayoutDashboard,
  Activity,
  Radar,
  TrendingUp,
  Brain,
  Orbit,
  Database,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Menu,
  X,
  ChevronRight,
  Sun,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { liveEvents, activeFlare, triggerManualFlare } = useTelemetry();

  const [utcTime, setUtcTime] = useState<string>('');
  const [uptime, setUptime] = useState<string>('00:00:00');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [muted, setMutedState] = useState(getMuted());

  // Clock updating in UTC format
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setUtcTime(d.toUTCString().replace('GMT', 'UTC'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // System Uptime simulation since mock boot
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setUptime(`${hours}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tabId: string) => {
    playSynthSound('click');
    setActiveTab(tabId);
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setMutedState(nextMuted);
    if (!nextMuted) {
      setTimeout(() => playSynthSound('click'), 100);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Monitoring', icon: Activity },
    { id: 'nowcasting', label: 'Nowcasting', icon: Radar },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
    { id: 'models', label: 'ML Models', icon: Brain },
    { id: 'satellite', label: 'Satellite Status', icon: Orbit },
    { id: 'database', label: 'Flare Database', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-spaceBg text-textPri font-sans overflow-hidden flex flex-col relative select-none cyber-grid">
      {/* Glow overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-accentCyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[350px] bg-accentBlue/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded bg-spaceBgSec/60 border border-white/10 hover:border-accentCyan/50 hover:bg-spaceBgSec transition-all text-textSec hover:text-accentCyan sm:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo Section */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <Sun className="w-8 h-8 text-accentCyan animate-solar-pulse" />
              <div className="absolute w-4 h-4 bg-orange-500 rounded-full blur-xs" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-wider text-textPri uppercase font-mono">ADITYA-L1</span>
                <span className="text-[9px] bg-accentCyan/20 text-accentCyan border border-accentCyan/30 px-1 rounded font-mono">SoLEXS + HEL1OS</span>
              </div>
              <p className="text-[10px] text-textMuted tracking-wider font-mono uppercase">ISRO Space Weather Platform</p>
            </div>
          </div>
        </div>

        {/* Global Alert Bar if solar flare active */}
        {activeFlare && (
          <div className="hidden lg:flex items-center gap-2 bg-dangerRed/10 border border-dangerRed/40 text-dangerRed px-4 py-1.5 rounded-full text-xs font-mono animate-pulse shadow-dangerGlow">
            <ShieldAlert className="w-4 h-4 text-dangerRed animate-bounce" />
            <span>CRITICAL WEATHER ALERT: CLASS {activeFlare.class} FLARE DETECTED - PEAK FLUX: {activeFlare.peakFlux.toExponential(2)} W/m² - SECONDS TO PEAK: {activeFlare.countdown}s</span>
          </div>
        )}

        {/* Top Navbar Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* UTC Clock & Uptime */}
          <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-4">
            <span className="font-mono text-xs text-accentCyan flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {utcTime}
            </span>
            <span className="text-[10px] text-textMuted font-mono uppercase">MISSION UP: {uptime}</span>
          </div>

          {/* Mute Audio Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => playSynthSound('hover')}
            className={`p-2 rounded bg-spaceBgSec/60 border border-white/10 text-textSec hover:text-accentCyan hover:border-accentCyan/40 transition-all cursor-pointer ${!muted && 'shadow-neonGlow border-accentCyan/30 text-accentCyan'}`}
            title={muted ? 'Unmute telemetry audio' : 'Mute telemetry audio'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Notifications Notification */}
          <div className="relative">
            <button
              onClick={() => {
                playSynthSound('click');
                setNotificationsOpen(!notificationsOpen);
              }}
              onMouseEnter={() => playSynthSound('hover')}
              className={`p-2 rounded bg-spaceBgSec/60 border border-white/10 text-textSec hover:text-accentCyan hover:border-accentCyan/40 transition-all cursor-pointer ${notificationsOpen && 'border-accentCyan/40 text-accentCyan'}`}
            >
              <Bell className="w-4 h-4" />
              {liveEvents.filter(e => e.type === 'alert' || e.type === 'warning').length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-dangerRed rounded-full animate-ping" />
              )}
            </button>

            {/* Notification Drawer Popup */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 glass-panel border border-white/10 rounded-lg shadow-2xl p-4 z-50 flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-1">
                  <span className="font-mono text-xs font-semibold text-textPri">Active Telemetry Alerts</span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-textMuted hover:text-textPri text-xs"
                  >
                    Close
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-thin">
                  {liveEvents.slice(0, 8).map(event => (
                    <div
                      key={event.id}
                      className={`p-2 rounded border text-2xs font-mono flex flex-col gap-1 ${
                        event.type === 'alert'
                          ? 'bg-dangerRed/10 border-dangerRed/30 text-dangerRed'
                          : event.type === 'warning'
                          ? 'bg-warningAmber/10 border-warningAmber/30 text-warningAmber'
                          : event.type === 'success'
                          ? 'bg-successGreen/10 border-successGreen/30 text-successGreen'
                          : 'bg-spaceBgSec border-white/5 text-textSec'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-semibold uppercase">{event.type}</span>
                        <span className="text-textMuted">{event.time}</span>
                      </div>
                      <p className="leading-tight">{event.message}</p>
                    </div>
                  ))}
                  {liveEvents.length === 0 && (
                    <p className="text-textMuted text-xs text-center py-4 font-mono">No telemetry events</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mission Health Badge */}
          <div className="flex items-center gap-2 bg-spaceBgSec/80 border border-white/10 px-3 py-1.5 rounded">
            <span className="w-1.5 h-1.5 bg-successGreen rounded-full animate-ping" />
            <span className="font-mono text-2xs uppercase tracking-wider text-textSec hidden sm:inline">L1-HALO STATUS:</span>
            <span className="font-mono text-2xs font-bold text-successGreen">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Core Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <aside
          className={`absolute sm:relative top-0 bottom-0 left-0 z-30 w-64 glass-panel border-r border-white/10 flex flex-col justify-between transition-transform duration-300 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
        >
          <div className="py-6 flex flex-col gap-1 overflow-y-auto px-3 scrollbar-thin">
            <div className="px-3 mb-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-textMuted">Payload Navigation</span>
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  onMouseEnter={() => playSynthSound('hover')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-mono tracking-wide transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-accentCyan/10 border-l-2 border-accentCyan text-accentCyan glow-border-cyan'
                      : 'text-textSec hover:text-textPri hover:bg-spaceBgSec/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accentCyan' : 'text-textSec'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Details */}
          <div className="p-4 border-t border-white/10 bg-black/20 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-2xs font-mono text-textSec">
              <span>Telemetry Rate</span>
              <span className="text-accentCyan">2.4 Gbps</span>
            </div>
            <div className="flex items-center justify-between text-2xs font-mono text-textSec">
              <span>Orbit Position</span>
              <span className="text-accentBlue">Halo L1</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-accentCyan h-full w-[85%] animate-pulse" />
            </div>
          </div>
        </aside>

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative z-10">
          {children}
        </main>

        {/* Right Insights Drawer */}
        {rightPanelOpen ? (
          <aside className="hidden xl:flex w-72 glass-panel border-l border-white/10 flex-col gap-6 p-5 overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center border-b border-white/15 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-accentCyan animate-solar-pulse" />
                Space Weather Feed
              </span>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="text-textMuted hover:text-textPri transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-col gap-4">
              {/* Solar Cycle Info */}
              <div className="p-3 bg-spaceBgSec/80 border border-white/5 rounded-lg">
                <span className="text-3xs font-mono text-accentCyan uppercase tracking-widest block mb-1">Solar Target</span>
                <span className="text-xs font-bold text-textPri font-mono block">Solar Cycle 25 (Active Phase)</span>
                <p className="text-[10px] text-textMuted mt-1 leading-normal">The solar peak is currently active, resulting in a higher frequency of M-class and X-class events.</p>
              </div>

              {/* KP Index */}
              <div className="p-3 bg-spaceBgSec/80 border border-white/5 rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest block">Geomagnetic index</span>
                  <span className="text-sm font-bold text-textPri font-mono">Kp Index</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-successGreen font-mono glow-text-cyan">3.2</span>
                  <span className="text-3xs text-textMuted font-mono block">NOMINAL</span>
                </div>
              </div>

              {/* Earth Impact Probability */}
              <div className="p-3 bg-spaceBgSec/80 border border-white/5 rounded-lg flex flex-col gap-2">
                <div className="flex justify-between text-2xs font-mono">
                  <span className="text-textSec">Earth Grid Impact Risk</span>
                  <span className="text-warningAmber font-bold">Medium (28%)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-successGreen to-warningAmber h-full w-[28%]" />
                </div>
              </div>

              {/* Satellite Payload Diagnostics */}
              <div className="p-3 bg-spaceBgSec/80 border border-white/5 rounded-lg flex flex-col gap-2">
                <span className="text-3xs font-mono text-textSec uppercase tracking-widest">Payload Health Matrix</span>
                <div className="flex justify-between items-center text-2xs font-mono">
                  <span className="text-textMuted">SoLEXS Spectrometer</span>
                  <span className="text-successGreen">99.8% (Active)</span>
                </div>
                <div className="flex justify-between items-center text-2xs font-mono">
                  <span className="text-textMuted">HEL1OS Hard X-Ray</span>
                  <span className="text-successGreen">99.5% (Active)</span>
                </div>
                <div className="flex justify-between items-center text-2xs font-mono">
                  <span className="text-textMuted">Reaction Wheels</span>
                  <span className="text-successGreen">100% (Locked)</span>
                </div>
                <div className="flex justify-between items-center text-2xs font-mono">
                  <span className="text-textMuted">Star Trackers</span>
                  <span className="text-warningAmber">92.1% (Calibrating)</span>
                </div>
              </div>

              {/* Solar Flare Trigger Panel */}
              <div className="p-4 bg-accentCyan/5 border border-accentCyan/20 rounded-lg flex flex-col gap-2.5">
                <span className="text-3xs font-mono text-accentCyan uppercase tracking-widest block font-bold">Solar Flare Simulator</span>
                <p className="text-[10px] text-textMuted leading-normal">Simulate payload triggers for diagnostic tests of prediction models.</p>
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  <button
                    onClick={() => triggerManualFlare('C')}
                    className="py-1 px-2 bg-spaceBg border border-white/10 hover:border-accentCyan/50 hover:bg-spaceBgSec rounded text-2xs font-mono text-textSec hover:text-accentCyan transition-colors cursor-pointer"
                  >
                    Class C
                  </button>
                  <button
                    onClick={() => triggerManualFlare('M')}
                    className="py-1 px-2 bg-spaceBg border border-white/10 hover:border-accentCyan/50 hover:bg-spaceBgSec rounded text-2xs font-mono text-textSec hover:text-accentCyan transition-colors cursor-pointer"
                  >
                    Class M
                  </button>
                  <button
                    onClick={() => triggerManualFlare('X')}
                    className="py-1 px-2 bg-spaceBg border border-dangerRed/40 hover:border-dangerRed hover:bg-dangerRed/10 rounded text-2xs font-mono text-textSec hover:text-dangerRed transition-colors cursor-pointer"
                  >
                    Class X
                  </button>
                </div>
              </div>
            </div>

            {/* Latest ISRO News Updates */}
            <div className="mt-auto flex flex-col gap-3">
              <span className="font-mono text-3xs uppercase tracking-widest text-textMuted border-b border-white/5 pb-2 block">ISRO Payload Logs</span>
              <div className="flex flex-col gap-2">
                <div className="text-3xs font-mono">
                  <span className="text-accentCyan block">2026-06-29</span>
                  <p className="text-textSec leading-tight mt-0.5">Aditya-L1 completes halo orbit period cycle, telemetry feeds continue uninterrupted.</p>
                </div>
                <div className="text-3xs font-mono">
                  <span className="text-accentCyan block">2026-06-25</span>
                  <p className="text-textSec leading-tight mt-0.5">HEL1OS registers micro-CME precursor signature. ML alert systems validated.</p>
                </div>
              </div>
            </div>
          </aside>
        ) : (
          <button
            onClick={() => setRightPanelOpen(true)}
            onMouseEnter={() => playSynthSound('hover')}
            className="hidden xl:flex fixed right-4 bottom-12 z-30 p-2.5 rounded-full bg-spaceBgSec border border-accentCyan/20 hover:border-accentCyan text-accentCyan shadow-neonGlow transition-all cursor-pointer animate-pulse"
            title="Expand Space Weather Feed"
          >
            <ChevronRight className="w-5 h-5 transform rotate-180" />
          </button>
        )}
      </div>

      {/* Footer bar */}
      <footer className="w-full glass-panel border-t border-white/10 h-10 flex items-center justify-between px-6 font-mono text-[10px] text-textMuted z-30">
        <div>Developed for ISRO Space Technology Hackathon</div>
        <div className="hidden sm:flex items-center gap-4">
          <span>Aditya-L1 Heliophysics Intelligence Center</span>
          <span className="w-1.5 h-1.5 rounded-full bg-successGreen" />
          <span>DSN Telemetry Synchronized</span>
        </div>
      </footer>
    </div>
  );
};
