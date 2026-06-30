import React from 'react';
import { useTelemetry } from '../hooks/useSimulatedTelemetry';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  BrainCircuit,
  Clock,
  Compass,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';

export const Forecasting: React.FC = () => {
  const { forecast } = useTelemetry();

  // Simulated 24-hour predictive risk timeline
  const forecastData = [
    { hour: '+2h', mClass: forecast.classM, xClass: forecast.classX },
    { hour: '+4h', mClass: Math.max(5, forecast.classM - 4), xClass: Math.max(1, forecast.classX - 1) },
    { hour: '+6h', mClass: Math.max(5, forecast.classM + 8), xClass: Math.max(1, forecast.classX + 2) },
    { hour: '+8h', mClass: Math.max(5, forecast.classM + 15), xClass: Math.max(1, forecast.classX + 6) },
    { hour: '+10h', mClass: Math.max(5, forecast.classM + 5), xClass: Math.max(1, forecast.classX + 3) },
    { hour: '+12h', mClass: Math.max(5, forecast.classM - 8), xClass: Math.max(1, forecast.classX - 2) },
    { hour: '+14h', mClass: Math.max(5, forecast.classM - 12), xClass: Math.max(1, forecast.classX - 4) },
    { hour: '+16h', mClass: Math.max(5, forecast.classM + 12), xClass: Math.max(1, forecast.classX + 4) },
    { hour: '+18h', mClass: Math.max(5, forecast.classM + 25), xClass: Math.max(1, forecast.classX + 9) },
    { hour: '+20h', mClass: Math.max(5, forecast.classM + 18), xClass: Math.max(1, forecast.classX + 5) },
    { hour: '+22h', mClass: Math.max(5, forecast.classM - 5), xClass: Math.max(1, forecast.classX - 2) },
    { hour: '+24h', mClass: forecast.classM, xClass: forecast.classX },
  ];


  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <section className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accentCyan/10 border border-accentCyan/20 rounded">
            <TrendingUp className="w-5 h-5 text-accentCyan" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-textPri uppercase tracking-wide">AI Predictive Forecasting</h1>
            <p className="text-xs text-textMuted">Aditya-L1 Temporal CNN solar flare probability model</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-2xs bg-spaceBgSec px-3 py-1.5 rounded border border-white/5">
          <BrainCircuit className="w-4 h-4 text-accentCyan animate-pulse" />
          <span>Active Model: SpatioTemporal-Trans-v2</span>
        </div>
      </section>

      {/* Main Row: Dials & Details */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Probabilities & Lead times (2 Columns wide) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Probability cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* M-Class Card */}
            <div className="glass-panel p-5 rounded-xl border border-white/10 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-3xs font-mono text-accentBlue uppercase tracking-widest block font-bold">Class M Forecast</span>
                <span className="text-2xl font-bold font-mono text-textPri">{forecast.classM}%</span>
                <p className="text-[10px] text-textMuted leading-normal mt-1">Probability of medium solar eruptive event (flux threshold &gt; 10⁻⁵ W/m²) occurring in the L1 region over the next 24h.</p>
              </div>
              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#4D9FFF"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * forecast.classM) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <Zap className="w-6 h-6 text-accentBlue" />
              </div>
            </div>

            {/* X-Class Card */}
            <div className="glass-panel p-5 rounded-xl border border-white/10 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-3xs font-mono text-dangerRed uppercase tracking-widest block font-bold">Class X Forecast</span>
                <span className="text-2xl font-bold font-mono text-textPri">{forecast.classX}%</span>
                <p className="text-[10px] text-textMuted leading-normal mt-1">Probability of severe solar eruptive event (flux threshold &gt; 10⁻⁴ W/m²) triggering global telemetry adjustments.</p>
              </div>
              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#FF4D6D"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * forecast.classX) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <AlertTriangle className="w-6 h-6 text-dangerRed animate-pulse" />
              </div>
            </div>
          </div>

          {/* Probability Distribution Time chart */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri block border-b border-white/10 pb-3">
              Solar Flare Risk Distribution Timeline (Next 24h)
            </span>
            <div className="h-64 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mClassGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4D9FFF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4D9FFF" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="xClassGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4D6D" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#FF4D6D" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="hour" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#B6C2CF', fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: '#B6C2CF', fontSize: 10, fontFamily: 'monospace' }} domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-panel p-3 border border-white/15 rounded font-mono text-2xs flex flex-col gap-1">
                            <span className="text-textMuted uppercase font-bold tracking-wider">Interval: {label}</span>
                            <span className="text-accentBlue">Class M Risk: {payload[0].value}%</span>
                            <span className="text-dangerRed">Class X Risk: {payload[1].value}%</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" name="M-Class" dataKey="mClass" stroke="#4D9FFF" strokeWidth={2} fillOpacity={1} fill="url(#mClassGrad)" />
                  <Area type="monotone" name="X-Class" dataKey="xClass" stroke="#FF4D6D" strokeWidth={1.5} fillOpacity={1} fill="url(#xClassGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Card: Gauges & Metrics (1 Column wide) */}
        <div className="flex flex-col gap-6">
          {/* Risk Speedometer */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri block border-b border-white/10 pb-2">
              Combined Solar Risk Index
            </span>
            <div className="flex flex-col items-center py-4 relative">
              {/* Semi-circular dial */}
              <div className="relative w-40 h-24 flex items-center justify-center overflow-hidden">
                <svg className="absolute top-0 w-40 h-40">
                  <circle cx="80" cy="80" r="68" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="transparent" strokeDasharray={213.6} strokeDashoffset={0} />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke={forecast.riskMeter > 60 ? '#FF4D6D' : forecast.riskMeter > 35 ? '#FFB300' : '#00E5FF'}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={213.6}
                    strokeDashoffset={213.6 - (213.6 * forecast.riskMeter) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute bottom-2 flex flex-col items-center">
                  <span className="text-2xl font-bold font-mono text-textPri">{forecast.riskMeter}%</span>
                  <span className="text-4xs font-mono text-textMuted uppercase tracking-widest">Risk Level</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 text-center text-4xs font-mono text-textMuted">
              <span className="text-successGreen">QUIET</span>
              <span className="text-warningAmber font-bold">ELEVATED</span>
              <span className="text-dangerRed animate-pulse">SEVERE</span>
            </div>
          </div>

          {/* AI Metrics card */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri block border-b border-white/10 pb-2 flex items-center gap-1">
              <Compass className="w-4 h-4 text-accentCyan" />
              AI Estimate Details
            </span>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-textMuted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Estimated Lead Time:
                </span>
                <span className="text-accentCyan font-bold">~{(forecast.leadTime / 60).toFixed(0)} mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textMuted">AI Model Confidence:</span>
                <span className="text-textPri font-bold">{forecast.confidence}%</span>
              </div>
              <div className="flex justify-between items-center font-mono">
                <span className="text-textMuted">Anomaly Check:</span>
                <span className="text-successGreen font-bold">STABLE</span>
              </div>
            </div>

            <div className="p-2.5 bg-spaceBgSec/80 border border-white/5 rounded text-[10px] text-textMuted font-mono flex gap-2">
              <Info className="w-4 h-4 text-accentCyan flex-shrink-0" />
              <p className="leading-tight">Model inputs re-evaluating SoLEXS flux density trends on a 250ms cadence.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
