import React, { useState } from 'react';
import { playSynthSound } from '../utils/sound';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  Brain,
  Cpu,
  BarChart4,
  Grid,
  Info
} from 'lucide-react';

export const Models: React.FC = () => {
  const [activeModel, setActiveModel] = useState<string>('transformer');

  const modelsList = [
    {
      id: 'transformer',
      name: 'Spatiotemporal Graph Transformer',
      precision: 0.984,
      recall: 0.976,
      f1: 0.980,
      auc: 0.994,
      inferenceTime: '24.1 ms',
      epochs: '250',
      parameters: '4.8M',
      loss: '0.0124',
      status: 'ACTIVE ENGINE'
    },
    {
      id: 'cnn',
      name: 'Temporal CNN (TCN)',
      precision: 0.971,
      recall: 0.965,
      f1: 0.968,
      auc: 0.986,
      inferenceTime: '8.4 ms',
      epochs: '400',
      parameters: '1.2M',
      loss: '0.0210',
      status: 'STANDBY'
    },
    {
      id: 'lstm',
      name: 'Bidirectional LSTM Network',
      precision: 0.942,
      recall: 0.938,
      f1: 0.940,
      auc: 0.968,
      inferenceTime: '14.2 ms',
      epochs: '500',
      parameters: '840K',
      loss: '0.0452',
      status: 'STANDBY'
    },
    {
      id: 'randomforest',
      name: 'Random Forest Regressor',
      precision: 0.886,
      recall: 0.875,
      f1: 0.880,
      auc: 0.912,
      inferenceTime: '1.8 ms',
      epochs: 'N/A',
      parameters: 'N/A',
      loss: '0.0980',
      status: 'INACTIVE'
    }
  ];

  const handleModelSelect = (id: string) => {
    playSynthSound('click');
    setActiveModel(id);
  };

  const activeModelDetails = modelsList.find(m => m.id === activeModel) || modelsList[0];

  // Feature weights data
  const featureWeights = [
    { name: 'SoLEXS Flux slope', weight: 0.86, color: '#00E5FF' },
    { name: 'HEL1OS flux rate', weight: 0.74, color: '#4D9FFF' },
    { name: 'Magnetic shear intensity', weight: 0.62, color: '#FFD54F' },
    { name: 'Active Region delta size', weight: 0.48, color: '#00E676' },
    { name: 'Sunspot structural class', weight: 0.35, color: '#FF9100' },
    { name: 'Sub-L1 temperature change', weight: 0.18, color: '#FF4D6D' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <section className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accentCyan/10 border border-accentCyan/20 rounded">
            <Brain className="w-5 h-5 text-accentCyan" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-textPri uppercase tracking-wide">Machine Learning Models</h1>
            <p className="text-xs text-textMuted">Forecasting models and confusion matrices evaluation</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-2xs bg-spaceBgSec px-3 py-1.5 rounded border border-white/5">
          <Cpu className="w-4 h-4 text-accentCyan animate-pulse" />
          <span>GPU Stream Cadence: 60Hz</span>
        </div>
      </section>

      {/* Selector & Details Row */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Model list selector */}
        <div className="flex flex-col gap-3 lg:col-span-1">
          <span className="font-mono text-3xs text-textMuted uppercase tracking-widest block px-1">Select Engine</span>
          {modelsList.map(m => (
            <button
              key={m.id}
              onClick={() => handleModelSelect(m.id)}
              className={`p-3 rounded-lg border text-left font-mono flex flex-col gap-1 cursor-pointer transition-all ${
                activeModel === m.id
                  ? 'bg-accentCyan/10 border-accentCyan text-accentCyan glow-border-cyan'
                  : 'bg-spaceBgSec/60 border-white/15 text-textSec hover:text-textPri hover:bg-spaceBgSec'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold">{m.name}</span>
                {m.status === 'ACTIVE ENGINE' && (
                  <span className="text-[8px] bg-successGreen/25 text-successGreen border border-successGreen/30 px-1 rounded font-bold animate-pulse">
                    LIVE
                  </span>
                )}
              </div>
              <span className="text-3xs text-textMuted uppercase tracking-widest mt-0.5">F1-SCORE: {m.f1.toFixed(3)}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Active Model Metrics (3 Columns wide) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="glass-panel p-3.5 rounded-lg flex flex-col gap-1 text-center">
              <span className="text-4xs font-mono text-textMuted uppercase tracking-wider">Precision</span>
              <span className="text-xl font-bold font-mono text-accentCyan">{activeModelDetails.precision.toFixed(3)}</span>
            </div>
            <div className="glass-panel p-3.5 rounded-lg flex flex-col gap-1 text-center">
              <span className="text-4xs font-mono text-textMuted uppercase tracking-wider">Recall</span>
              <span className="text-xl font-bold font-mono text-accentBlue">{activeModelDetails.recall.toFixed(3)}</span>
            </div>
            <div className="glass-panel p-3.5 rounded-lg flex flex-col gap-1 text-center">
              <span className="text-4xs font-mono text-textMuted uppercase tracking-wider">F1-Score</span>
              <span className="text-xl font-bold font-mono text-forecastYellow">{activeModelDetails.f1.toFixed(3)}</span>
            </div>
            <div className="glass-panel p-3.5 rounded-lg flex flex-col gap-1 text-center">
              <span className="text-4xs font-mono text-textMuted uppercase tracking-wider">ROC AUC</span>
              <span className="text-xl font-bold font-mono text-successGreen">{activeModelDetails.auc.toFixed(3)}</span>
            </div>
            <div className="glass-panel p-3.5 rounded-lg flex flex-col gap-1 text-center col-span-2 md:col-span-1">
              <span className="text-4xs font-mono text-textMuted uppercase tracking-wider">Inference Time</span>
              <span className="text-sm font-bold font-mono text-textPri mt-1">{activeModelDetails.inferenceTime}</span>
            </div>
          </div>

          {/* Core Visual Grid: Confusion Matrix & Feature Weights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Confusion Matrix */}
            <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri block border-b border-white/10 pb-3 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-accentCyan" />
                Diagnostic Confusion Matrix
              </span>

              {/* Confusion matrix grid */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="grid grid-cols-3 text-center text-3xs font-mono text-textMuted">
                  <span />
                  <span>PREDICTED FLARE</span>
                  <span>PREDICTED QUIET</span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center text-center">
                  <span className="text-4xs font-mono text-textMuted uppercase text-right pr-2">ACTUAL FLARE</span>
                  {/* True Positive */}
                  <div className="p-4 bg-accentCyan/15 border border-accentCyan/40 rounded flex flex-col items-center hover:bg-accentCyan/25 transition-all group relative cursor-pointer">
                    <span className="text-lg font-bold font-mono text-accentCyan">97.6%</span>
                    <span className="text-4xs font-mono text-textMuted uppercase">True Positive (TP)</span>
                    <div className="absolute inset-0 bg-accentCyan/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                      <span className="text-[9px] font-mono text-white">Trigger alarms</span>
                    </div>
                  </div>
                  {/* False Negative */}
                  <div className="p-4 bg-dangerRed/5 border border-dangerRed/20 rounded flex flex-col items-center hover:bg-dangerRed/10 transition-all cursor-pointer">
                    <span className="text-lg font-bold font-mono text-dangerRed">2.4%</span>
                    <span className="text-4xs font-mono text-textMuted uppercase">False Neg. (FN)</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center text-center">
                  <span className="text-4xs font-mono text-textMuted uppercase text-right pr-2">ACTUAL QUIET</span>
                  {/* False Positive */}
                  <div className="p-4 bg-warningAmber/5 border border-warningAmber/20 rounded flex flex-col items-center hover:bg-warningAmber/10 transition-all cursor-pointer">
                    <span className="text-lg font-bold font-mono text-warningAmber">1.6%</span>
                    <span className="text-4xs font-mono text-textMuted uppercase">False Pos. (FP)</span>
                  </div>
                  {/* True Negative */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded flex flex-col items-center hover:bg-white/10 transition-all cursor-pointer">
                    <span className="text-lg font-bold font-mono text-textPri">98.4%</span>
                    <span className="text-4xs font-mono text-textMuted uppercase">True Negative (TN)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Weights Chart */}
            <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri block border-b border-white/10 pb-3 flex items-center gap-1.5">
                <BarChart4 className="w-4 h-4 text-accentCyan" />
                Input Feature Importance
              </span>

              <div className="h-48 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureWeights} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                    <XAxis type="number" stroke="rgba(255,255,255,0.15)" tick={{ fill: '#B6C2CF', fontSize: 10, fontFamily: 'monospace' }} domain={[0, 1.0]} />
                    <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.15)" tick={{ fill: '#B6C2CF', fontSize: 9, fontFamily: 'monospace' }} width={100} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="glass-panel p-2 border border-white/15 rounded font-mono text-3xs">
                              <span>Weight: {payload[0].value}</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                      {featureWeights.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Diagnostic Info Footer */}
      <section className="glass-panel p-4 rounded-lg flex items-start gap-3 border border-white/5 bg-spaceBgSec/40">
        <Info className="w-5 h-5 text-accentCyan mt-0.5 flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs font-bold text-textPri uppercase">AI Forecasting Pipeline</span>
          <p className="text-[11px] text-textMuted leading-normal">
            Neural models undergo automated training weights updates at ISRO computational clusters every 24 hours. The Spatiotemporal Graph Transformer monitors multi-wavelength solar regions, analyzing loops topological structures to anticipate flare eruptions.
          </p>
        </div>
      </section>
    </div>
  );
};
