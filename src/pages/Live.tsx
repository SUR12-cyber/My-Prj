import React from 'react';
import { useTelemetry } from '../hooks/useSimulatedTelemetry';
import { playSynthSound } from '../utils/sound';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Brush,
  CartesianGrid
} from 'recharts';
import {
  Play,
  Pause,
  Trash2,
  Info,
  Activity,
  LineChart
} from 'lucide-react';

export const Live: React.FC = () => {
  const {
    fluxHistory,
    currentSoft,
    currentHard,
    isPlaying,
    setIsPlaying,
    simulationSpeed,
    setSimulationSpeed,
    clearHistory,
  } = useTelemetry();

  const speeds = [1, 2, 5, 10];

  const handleSpeedChange = (speed: number) => {
    playSynthSound('click');
    setSimulationSpeed(speed);
  };

  const togglePlay = () => {
    playSynthSound('click');
    setIsPlaying(!isPlaying);
  };

  const handleClear = () => {
    playSynthSound('click');
    clearHistory();
  };

  // Custom futuristic tooltip styled as space weather telemetry readout
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 border border-accentCyan/30 rounded font-mono text-2xs flex flex-col gap-1.5 shadow-2xl">
          <span className="text-textMuted uppercase tracking-wider block border-b border-white/5 pb-1 mb-0.5">Time: {label}</span>
          <div className="flex items-center gap-1.5 text-accentCyan">
            <span className="w-1.5 h-1.5 rounded-full bg-accentCyan" />
            <span>SoLEXS (Soft): {payload[0].value.toExponential(4)} W/m²</span>
          </div>
          <div className="flex items-center gap-1.5 text-accentBlue">
            <span className="w-1.5 h-1.5 rounded-full bg-accentBlue" />
            <span>HEL1OS (Hard): {payload[1].value.toExponential(4)} W/m²</span>
          </div>
          <div className="flex items-center gap-1.5 text-textPri border-t border-white/5 pt-1 mt-0.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Combined: {(payload[0].value + payload[1].value).toExponential(4)} W/m²</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Time-Series Controller Card */}
      <section className="glass-panel p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accentCyan/10 border border-accentCyan/20 rounded">
            <Activity className="w-5 h-5 text-accentCyan" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-textPri uppercase tracking-wide">Live Telemetry Plotter</h1>
            <p className="text-xs text-textMuted">Real-time Solar Low/High Energy flux density stream</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pause / Play */}
          <button
            onClick={togglePlay}
            onMouseEnter={() => playSynthSound('hover')}
            className={`flex items-center gap-1.5 py-1.5 px-4 rounded border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              isPlaying
                ? 'bg-warningAmber/10 border-warningAmber/30 text-warningAmber hover:bg-warningAmber/20'
                : 'bg-successGreen/10 border-successGreen/30 text-successGreen hover:bg-successGreen/20 shadow-neonGlow'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume stream</span>
              </>
            )}
          </button>

          {/* Speed multiplier selection */}
          <div className="flex items-center bg-spaceBgSec border border-white/10 rounded overflow-hidden">
            <span className="text-3xs font-mono text-textMuted uppercase tracking-wider px-2 border-r border-white/10 py-1.5">Speed</span>
            {speeds.map(sp => (
              <button
                key={sp}
                onClick={() => handleSpeedChange(sp)}
                className={`px-3 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                  simulationSpeed === sp
                    ? 'bg-accentCyan text-spaceBg'
                    : 'text-textSec hover:text-textPri hover:bg-white/5'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>

          {/* Clear History */}
          <button
            onClick={handleClear}
            onMouseEnter={() => playSynthSound('hover')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded border border-dangerRed/30 text-dangerRed hover:bg-dangerRed/10 text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
            title="Reset telemetry timeline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Plot</span>
          </button>
        </div>
      </section>

      {/* Main Interactive Recharts Card */}
      <section className="glass-panel p-5 rounded-xl border border-white/10 flex-1 flex flex-col gap-4 min-h-[450px]">
        {/* Real-time coordinates */}
        <div className="flex justify-between items-center text-xs font-mono text-textSec border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-accentCyan animate-pulse" />
            <span>TIME-FLUX DENSITY DIAGRAM (SoLEXS & HEL1OS STREAMS)</span>
          </div>
          <div className="flex gap-4 text-3xs font-mono">
            <span>SOFT (CURRENT): <span className="text-accentCyan font-bold">{currentSoft.toExponential(3)}</span> W/m²</span>
            <span>HARD (CURRENT): <span className="text-accentBlue font-bold">{currentHard.toExponential(3)}</span> W/m²</span>
          </div>
        </div>

        {/* Recharts container */}
        <div className="flex-1 w-full min-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fluxHistory} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
              <defs>
                {/* Soft X-ray area gradient color mapping */}
                <linearGradient id="softGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                </linearGradient>
                {/* Hard X-ray area gradient color mapping */}
                <linearGradient id="hardGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4D9FFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4D9FFF" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />

              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: '#B6C2CF', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />

              <YAxis
                stroke="rgba(255,255,255,0.3)"
                tickFormatter={(value) => value.toExponential(1)}
                tick={{ fill: '#B6C2CF', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                domain={[1e-8, 'auto']}
                scale="log"
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 229, 255, 0.2)', strokeWidth: 1.5 }} />

              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#B6C2CF'
                }}
              />

              {/* Area mappings */}
              <Area
                type="monotone"
                name="SoLEXS Soft X-Ray (1-8 Å)"
                dataKey="soft"
                stroke="#00E5FF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#softGradient)"
                activeDot={{ r: 5, stroke: '#00E5FF', strokeWidth: 1 }}
              />

              <Area
                type="monotone"
                name="HEL1OS Hard X-Ray (>10 keV)"
                dataKey="hard"
                stroke="#4D9FFF"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#hardGradient)"
                activeDot={{ r: 4, stroke: '#4D9FFF', strokeWidth: 1 }}
              />

              <Brush
                dataKey="time"
                height={20}
                stroke="rgba(0, 229, 255, 0.2)"
                fill="rgba(7, 19, 30, 0.8)"
                tickFormatter={() => ''}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Dynamic Information Legend */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-lg flex items-start gap-3 border border-white/5 bg-spaceBgSec/40">
          <Info className="w-5 h-5 text-accentCyan mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold text-textPri uppercase">SoLEXS Spectrometer Readings</span>
            <p className="text-[11px] text-textMuted leading-normal">
              Measures soft X-ray solar flares from 1 Å to 8 Å. Solar flares emit high energy photons that reach SoLEXS within 8 minutes. Significant flux deviations above 10⁻⁵ W/m² denote active Coronal eruptions.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-lg flex items-start gap-3 border border-white/5 bg-spaceBgSec/40">
          <Info className="w-5 h-5 text-accentBlue mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold text-textPri uppercase">HEL1OS Spectrometer Readings</span>
            <p className="text-[11px] text-textMuted leading-normal">
              Measures solar flares in hard X-rays (&gt;10 keV). Standard hard X-ray bursts provide high temporal resolution signatures of particle acceleration and magnetohydrodynamic energy releases.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
