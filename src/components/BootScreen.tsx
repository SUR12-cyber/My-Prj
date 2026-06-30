import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Cpu, Radio } from 'lucide-react';
import { playSynthSound } from '../utils/sound';

interface BootScreenProps {
  onBootComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [bootFinished, setBootFinished] = useState(false);

  const diagnosticLogs = [
    'SYS: Bootstrapping solar telemetry decoders...',
    'NET: Connecting to Aditya-L1 DSN (Deep Space Network) via IDSN Byalalu...',
    'PAYLOAD: Initializing SoLEXS (Solar Low Energy X-ray Spectrometer)...',
    'PAYLOAD: Initializing HEL1OS (High Energy L1 Orbiting Spectrometer)...',
    'MODEL: Loading Temporal CNN prediction weights...',
    'MODEL: Loading Graph Attention Networks for active region analysis...',
    'ORBIT: Verifying Lagrange L1 Halo Orbit coordinates...',
    'SYS: Fetching space weather warning thresholds (NOAA/ISRO standards)...',
    'SYS: Solar Flare forecasting models ONLINE (v4.2.1-Alpha)...',
    'STATUS: Telemetry secure. Aditya-L1 Mission control synchronization complete.',
  ];

  // Play boot sweep sound on mount
  useEffect(() => {
    playSynthSound('boot');
  }, []);

  // Simulating loading progress and diagnostics logs
  useEffect(() => {
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBootFinished(true);
          return 100;
        }

        // Incrementally add logs based on progress
        const nextProgress = prev + Math.floor(Math.random() * 8) + 4;
        const cappedProgress = Math.min(nextProgress, 100);

        const logThreshold = Math.floor(diagnosticLogs.length * (cappedProgress / 100));
        if (currentLogIndex < logThreshold && currentLogIndex < diagnosticLogs.length) {
          setLogs(l => [...l, diagnosticLogs[currentLogIndex]]);
          currentLogIndex++;
          playSynthSound('hover');
        }

        return cappedProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    playSynthSound('success');
    onBootComplete();
  };

  return (
    <div className="fixed inset-0 bg-spaceBg z-50 flex flex-col justify-center items-center p-6 select-none overflow-hidden cyber-grid">
      <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(0, 229, 255, 0.05) 0%, transparent 80%)" />

      {/* Main glass containment card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl glass-panel p-8 rounded-xl border border-accentCyan/20 relative scanline-effect shadow-cyanGlow"
      >
        {/* Header decoration */}
        <div className="flex justify-between items-center border-b border-accentCyan/20 pb-4 mb-6">
          <div className="flex items-center gap-2 text-accentCyan">
            <Rocket className="w-5 h-5 animate-pulse" />
            <span className="font-mono text-sm tracking-wider uppercase font-semibold">ADITYA-L1 MISSION CONTROL v1.0.0</span>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-textSec">LOC-T: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* ISRO inspired emblem */}
        <div className="flex flex-col items-center justify-center my-6 py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-accentCyan/20 rounded-full blur-xl animate-pulse" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full border-2 border-dashed border-accentCyan flex items-center justify-center relative z-10"
            >
              <div className="w-16 h-16 rounded-full border border-accentCyan/40 flex items-center justify-center bg-spaceBg">
                <Cpu className="w-8 h-8 text-accentCyan animate-pulse" />
              </div>
            </motion.div>
          </div>
          <h2 className="text-xl font-bold mt-4 tracking-wide uppercase text-textPri glow-text-cyan text-center">
            Solar Flare Forecasting & Nowcasting
          </h2>
          <p className="text-xs text-textMuted mt-1">SoLEXS + HEL1OS Telemetry Dashboard</p>
        </div>

        {/* Log diagnostics readout */}
        <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-textSec h-48 overflow-y-auto border border-white/5 flex flex-col gap-1.5 scrollbar-thin">
          <AnimatePresence>
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-start gap-2"
              >
                {log.startsWith('CRITICAL') || log.startsWith('ALERT') ? (
                  <span className="text-dangerRed">▶ {log}</span>
                ) : log.endsWith('complete.') || log.endsWith('ONLINE (v4.2.1-Alpha)...') ? (
                  <span className="text-successGreen">✔ {log}</span>
                ) : (
                  <span className="text-accentCyan/80">❯ {log}</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loading metrics */}
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-mono text-textSec">
            <div className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-accentCyan animate-ping" />
              <span>SYNCHRONIZING TELEMETRY STREAMS</span>
            </div>
            <span>{progress}%</span>
          </div>

          {/* Progress bar container */}
          <div className="w-full bg-spaceBgSec/80 border border-white/10 rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-accentBlue to-accentCyan h-full shadow-neonGlow"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Interactive button on complete */}
        <div className="mt-8 flex justify-center h-12">
          <AnimatePresence>
            {bootFinished && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnter}
                className="bg-gradient-to-r from-accentCyan to-accentBlue text-spaceBg font-mono text-sm tracking-wider uppercase font-bold py-2 px-8 rounded-md shadow-neonGlow hover:from-white hover:to-accentCyan transition-all border border-accentCyan/30 cursor-pointer"
              >
                Enter Mission Control
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer credits inside boot screen */}
      <div className="absolute bottom-6 font-mono text-2xs text-textMuted uppercase tracking-widest text-center">
        Aditya-L1 Space Weather Intelligence Platform // ISRO Hackathon
      </div>
    </div>
  );
};
