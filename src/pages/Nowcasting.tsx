import React from 'react';
import { useTelemetry } from '../hooks/useSimulatedTelemetry';
import { playSynthSound } from '../utils/sound';
import { motion } from 'framer-motion';
import {
  Radar,
  ShieldAlert,
  Timer,
  CheckCircle2,
  AlertOctagon,
  Volume2
} from 'lucide-react';

export const Nowcasting: React.FC = () => {
  const { currentSoft, activeFlare } = useTelemetry();

  // Helper to determine the current phase of the solar lifecycle
  const getActivePhaseIndex = (): number => {
    if (!activeFlare) return 0; // Quiet
    const progress = (activeFlare.duration - activeFlare.countdown) / activeFlare.duration;
    if (progress < 0.1) return 1; // Buildup
    if (progress < 0.2) return 2; // Precursor
    if (progress < 0.3) return 3; // Detection
    if (progress < 0.5) return 4; // Peak
    if (progress < 0.95) return 5; // Decay
    return 6; // Recovery
  };

  const activeIndex = getActivePhaseIndex();

  const timelinePhases = [
    { label: 'Quiet', desc: 'Baseline thermal background flux' },
    { label: 'Buildup', desc: 'Magnetic flux buildup in active region' },
    { label: 'Precursor', desc: 'Micro-burst emission registered' },
    { label: 'Detection', desc: 'Autonomous trigger threshold breached' },
    { label: 'Peak', desc: 'Maximum electromagnetic energy flux' },
    { label: 'Decay', desc: 'Coronal loop thermal cooling' },
    { label: 'Recovery', desc: 'Sensors returning to baseline tracking' }
  ];

  const handleTriggerAlertBeep = () => {
    playSynthSound('alert');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <section className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accentCyan/10 border border-accentCyan/20 rounded">
            <Radar className="w-5 h-5 text-accentCyan animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-textPri uppercase tracking-wide">Nowcasting Panel</h1>
            <p className="text-xs text-textMuted">Autonomous solar eruption detection and diagnostic status</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-2xs bg-spaceBgSec px-3 py-1.5 rounded border border-white/5">
          <span>AI Latency:</span>
          <span className="text-accentCyan font-bold">120ms</span>
        </div>
      </section>

      {/* Main Alert Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Main Detection readout (2 columns wide) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {activeFlare ? (
            /* CRITICAL FLARE ACTIVE */
            <div className="glass-panel-danger p-6 rounded-xl border border-dangerRed/40 flex flex-col gap-6 relative overflow-hidden animate-alert-blink">
              <div className="absolute top-0 right-0 w-32 h-32 bg-dangerRed/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 text-dangerRed">
                  <ShieldAlert className="w-6 h-6 animate-bounce" />
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-textMuted">Heliophysics Alert</span>
                    <h2 className="text-xl font-bold font-mono text-dangerRed uppercase">Class {activeFlare.class} Solar Flare Active</h2>
                  </div>
                </div>
                <div className="text-right flex flex-col gap-0.5">
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest">Confidence</span>
                  <span className="text-base font-bold text-textPri font-mono">{activeFlare.confidence.toFixed(1)}%</span>
                </div>
              </div>

              {/* Flare details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div className="p-3 bg-black/35 rounded border border-dangerRed/20 flex flex-col gap-1">
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest">Peak Soft Flux</span>
                  <span className="text-sm font-bold text-textPri font-mono">{activeFlare.peakFlux.toExponential(2)}</span>
                </div>
                <div className="p-3 bg-black/35 rounded border border-dangerRed/20 flex flex-col gap-1">
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest">Detection Time</span>
                  <span className="text-sm font-bold text-textPri font-mono">{activeFlare.startTime}</span>
                </div>
                <div className="p-3 bg-black/35 rounded border border-dangerRed/20 flex flex-col gap-1">
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest">Est. Duration</span>
                  <span className="text-sm font-bold text-textPri font-mono">{activeFlare.duration} ticks</span>
                </div>
                <div className="p-3 bg-black/35 rounded border border-dangerRed/20 flex flex-col gap-1">
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest">Peak Countdown</span>
                  <span className="text-sm font-bold text-textPri font-mono flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-dangerRed animate-spin" />
                    {activeFlare.countdown}s
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTriggerAlertBeep}
                  className="flex items-center gap-2 py-2 px-4 bg-dangerRed/25 border border-dangerRed/50 hover:bg-dangerRed/40 text-dangerRed font-mono text-xs font-bold rounded tracking-wider uppercase transition-all shadow-lg cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Siren Override Beep</span>
                </button>
                <span className="text-2xs font-mono text-dangerRed uppercase tracking-wider animate-pulse">Siren triggered in mission control room</span>
              </div>
            </div>
          ) : (
            /* SYSTEM STANDBY - QUIET STATE */
            <div className="glass-panel p-6 rounded-xl border border-white/10 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-successGreen/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 text-successGreen">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-textMuted">Telemetry Status</span>
                    <h2 className="text-xl font-bold font-mono text-successGreen uppercase">Solar Status: Quiet</h2>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest block">Confidence index</span>
                  <span className="text-base font-bold text-textPri font-mono">98.9%</span>
                </div>
              </div>

              <p className="text-sm text-textSec leading-relaxed">
                Aditya-L1 SoLEXS & HEL1OS telemetry detectors are monitoring the solar atmosphere. X-ray fluxes match quiescent baseline expectations (~{currentSoft.toExponential(2)} W/m²). No immediate active region magnetic loops showing explosive reconnection profiles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-spaceBgSec/80 border border-white/5 rounded flex flex-col gap-1">
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest">Active Regions</span>
                  <span className="text-xs font-bold text-textPri font-mono">AR3312, AR3315</span>
                </div>
                <div className="p-3 bg-spaceBgSec/80 border border-white/5 rounded flex flex-col gap-1">
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest">Trigger Risk</span>
                  <span className="text-xs font-bold text-successGreen font-mono">LOW (12%)</span>
                </div>
                <div className="p-3 bg-spaceBgSec/80 border border-white/5 rounded flex flex-col gap-1">
                  <span className="text-3xs font-mono text-textMuted uppercase tracking-widest">AI Status</span>
                  <span className="text-xs font-bold text-accentCyan font-mono">MONITORING</span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Solar Activity Timeline */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri block border-b border-white/10 pb-3">
              Solar Flare Evolution Phase Timeline
            </span>

            {/* Horizontal Timeline */}
            <div className="relative mt-8 mb-4 px-2">
              {/* Connecting line */}
              <div className="absolute top-[15px] left-0 right-0 h-0.5 bg-white/10 z-0" />
              <div
                className="absolute top-[15px] left-0 h-0.5 bg-accentCyan transition-all duration-1000 ease-out z-0"
                style={{ width: `${(activeIndex / (timelinePhases.length - 1)) * 100}%` }}
              />

              <div className="flex justify-between items-center relative z-10">
                {timelinePhases.map((phase, idx) => {
                  const isPast = idx < activeIndex;
                  const isActive = idx === activeIndex;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-3 group relative cursor-help">
                      {/* Node circle */}
                      <motion.div
                        animate={
                          isActive
                            ? { scale: [1, 1.25, 1], borderColor: ['#00E5FF', '#4D9FFF', '#00E5FF'] }
                            : {}
                        }
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-spaceBg border-accentCyan text-accentCyan shadow-neonGlow'
                            : isPast
                            ? 'bg-accentCyan text-spaceBg border-accentCyan'
                            : 'bg-spaceBgSec border-white/15 text-textMuted'
                        }`}
                      >
                        {idx + 1}
                      </motion.div>

                      {/* Tooltip bubble on hover */}
                      <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-35 bg-spaceBgSec border border-white/15 px-3 py-1.5 rounded w-44 text-center">
                        <span className="font-mono text-xs text-textPri font-bold block">{phase.label}</span>
                        <span className="text-3xs text-textMuted leading-tight block mt-0.5">{phase.desc}</span>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold tracking-wide transition-all ${
                          isActive ? 'text-accentCyan glow-text-cyan' : isPast ? 'text-textSec' : 'text-textMuted'
                        }`}
                      >
                        {phase.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Confidence Dial & Quick diagnostics (1 column wide) */}
        <div className="flex flex-col gap-6">
          {/* Circular probability dial */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri block border-b border-white/10 pb-2">
              Detection Matrix
            </span>

            <div className="flex flex-col items-center py-4 relative">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke={activeFlare ? '#FF4D6D' : '#00E5FF'}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={376.8}
                    strokeDashoffset={376.8 - (376.8 * (activeFlare ? activeFlare.confidence : 98.9)) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold font-mono text-textPri">
                    {activeFlare ? activeFlare.confidence.toFixed(1) : '98.9'}%
                  </span>
                  <span className="text-4xs font-mono text-textMuted uppercase tracking-widest">Confidence</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-textSec">Target:</span>
                <span className="text-textPri font-bold">Active Region AR3312</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-textSec">Classification Mode:</span>
                <span className="text-accentCyan font-bold">AI Multi-label</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-textSec">Telemetry Latency:</span>
                <span className="text-successGreen font-bold">120ms</span>
              </div>
            </div>
          </div>

          {/* Quick Warning Advice Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri block border-b border-white/10 pb-2 flex items-center gap-1 text-warningAmber">
              <AlertOctagon className="w-4 h-4 text-warningAmber" />
              Safety Protocols
            </span>
            <div className="flex flex-col gap-3 font-mono text-[11px] text-textSec leading-normal">
              <div className="p-2.5 bg-spaceBgSec/80 border-l-2 border-accentCyan rounded-r">
                <span className="font-bold text-textPri uppercase block mb-0.5 text-3xs">SoLEXS Filters</span>
                Automatic shutter controls calibrate dynamically to suppress pixel saturation during X-class flares.
              </div>
              <div className="p-2.5 bg-spaceBgSec/80 border-l-2 border-accentBlue rounded-r">
                <span className="font-bold text-textPri uppercase block mb-0.5 text-3xs">Antenna Alignment</span>
                In the event of communication SNR degradation, DSN aligns antenna polarization.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
