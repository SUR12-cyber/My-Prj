import React, { useEffect, useRef } from 'react';
import { useTelemetry } from '../hooks/useSimulatedTelemetry';
import { playSynthSound } from '../utils/sound';
import {
  Sun,
  Activity,
  Zap,
  Clock,
  Radio,
  AlertOctagon,
  Cpu
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    fluxHistory,
    currentSoft,
    currentHard,
    currentClass,
    activeFlare,
    forecast,
    liveEvents
  } = useTelemetry();

  // Reference for the custom solar corona canvas animation
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 240);
    let height = (canvas.height = 240);

    // Particle structure for solar eruptions
    interface SolarEruption {
      angle: number;
      dist: number;
      speed: number;
      size: number;
      alpha: number;
      color: string;
    }

    const eruptions: SolarEruption[] = [];

    const solarColors = ['#FFD54F', '#FFB300', '#FF4D6D', '#FF9100', '#00E5FF'];

    // Render loop
    const animateSun = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      // Adjust size based on active flare class
      let baseRadius = 45;
      let turbulence = 1;
      let coronaGlow = 35;

      if (currentClass === 'C') {
        baseRadius = 48;
        turbulence = 1.6;
        coronaGlow = 45;
      } else if (currentClass === 'M') {
        baseRadius = 52;
        turbulence = 2.5;
        coronaGlow = 60;
      } else if (currentClass === 'X') {
        baseRadius = 58;
        turbulence = 4.2;
        coronaGlow = 90;
      }

      // Draw background glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.5, cx, cy, baseRadius + coronaGlow);
      if (currentClass === 'X' || currentClass === 'M') {
        glowGrad.addColorStop(0, 'rgba(255, 77, 109, 0.45)');
        glowGrad.addColorStop(0.4, 'rgba(255, 145, 0, 0.25)');
        glowGrad.addColorStop(1, 'rgba(7, 19, 30, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(255, 213, 79, 0.35)');
        glowGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.12)');
        glowGrad.addColorStop(1, 'rgba(7, 19, 30, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius + coronaGlow, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic corona flares
      ctx.strokeStyle = currentClass === 'X' || currentClass === 'M' ? '#FF4D6D' : '#00E5FF';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      const numPoints = 80;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const timeFactor = Date.now() * 0.003;
        const noise = Math.sin(angle * 12 + timeFactor) * Math.cos(angle * 6 - timeFactor * 1.5) * turbulence * 6;
        const r = baseRadius + noise + Math.random() * 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Core Sun Globe
      const sunGrad = ctx.createRadialGradient(cx - 5, cy - 5, 0, cx, cy, baseRadius);
      if (currentClass === 'X' || currentClass === 'M') {
        sunGrad.addColorStop(0, '#FFFFFF');
        sunGrad.addColorStop(0.3, '#FF9100');
        sunGrad.addColorStop(1, '#FF4D6D');
      } else {
        sunGrad.addColorStop(0, '#FFFFFF');
        sunGrad.addColorStop(0.2, '#FFD54F');
        sunGrad.addColorStop(0.8, '#FFB300');
        sunGrad.addColorStop(1, '#FF9100');
      }
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Spawn solar flare particle eruptions
      if (Math.random() < 0.3 + (currentClass !== 'None' ? 0.5 : 0)) {
        eruptions.push({
          angle: Math.random() * Math.PI * 2,
          dist: baseRadius,
          speed: Math.random() * 1.5 + 0.5 + (currentClass !== 'None' ? 2 : 0),
          size: Math.random() * 2.5 + 1,
          alpha: 1,
          color: solarColors[Math.floor(Math.random() * solarColors.length)],
        });
      }

      // Animate solar particles shooting out
      for (let i = eruptions.length - 1; i >= 0; i--) {
        const er = eruptions[i];
        er.dist += er.speed;
        er.alpha -= 0.015;
        if (er.alpha <= 0 || er.dist > width / 2) {
          eruptions.splice(i, 1);
          continue;
        }

        const px = cx + Math.cos(er.angle) * er.dist;
        const py = cy + Math.sin(er.angle) * er.dist;

        ctx.fillStyle = er.color;
        ctx.globalAlpha = er.alpha;
        ctx.beginPath();
        ctx.arc(px, py, er.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(animateSun);
    };

    animateSun();

    return () => cancelAnimationFrame(animId);
  }, [currentClass]);

  // Generate sparklines for stats based on past flux history
  const getSparklineData = (type: 'soft' | 'hard') => {
    const history = fluxHistory.slice(-12);
    if (history.length === 0) return '0,50 100,50';
    const minVal = Math.min(...history.map(d => d[type]));
    const maxVal = Math.max(...history.map(d => d[type]));
    const range = maxVal - minVal || 1.0;

    return history
      .map((d, index) => {
        const x = (index / (history.length - 1)) * 90 + 5;
        // Invert Y since SVGs coordinate system starts at top-left
        const y = 35 - ((d[type] - minVal) / range) * 25;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const getAccuracySparkline = () => {
    return '5,35 15,20 25,28 35,15 45,22 55,10 65,18 75,5 85,12 95,8';
  };

  const getLeadTimeSparkline = () => {
    return '5,10 15,12 25,8 35,22 45,18 55,30 65,25 75,32 85,28 95,35';
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Hero & Sun Visualizer Section */}
      <section className="glass-panel p-6 sm:p-8 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-2xl">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accentCyan animate-ping" />
            <span className="font-mono text-2xs uppercase tracking-widest text-accentCyan font-bold">Aditya-L1 Real-Time Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPri uppercase font-mono">
            Solar Flare Forecasting & Nowcasting
          </h1>
          <p className="text-sm text-textSec max-w-xl leading-relaxed">
            Real-time monitoring and AI-powered prediction of Solar X-ray events from Aditya-L1 payloads. Leveraging the{' '}
            <span className="text-accentCyan font-semibold font-mono">SoLEXS</span> (Soft X-ray spectrometer) and{' '}
            <span className="text-accentBlue font-semibold font-mono">HEL1OS</span> (Hard X-ray spectrometer) instruments to identify Solar energetic particles and coronal mass ejection triggers.
          </p>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="bg-spaceBgSec border border-white/10 px-3 py-1.5 rounded flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-accentCyan" />
              <span className="font-mono text-2xs text-textMuted uppercase">Sub-L1 Orbit:</span>
              <span className="font-mono text-2xs font-bold text-accentCyan">NOMINAL</span>
            </div>
            <div className="bg-spaceBgSec border border-white/10 px-3 py-1.5 rounded flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-mono text-2xs text-textMuted uppercase">Solar Activity Index:</span>
              <span className={`font-mono text-2xs font-bold ${currentClass !== 'None' ? 'text-dangerRed glow-text-red animate-pulse' : 'text-successGreen'}`}>
                {currentClass !== 'None' ? `CLASS ${currentClass} ERUPTION` : 'QUIET'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Sun Visualizer Canvas */}
        <div className="relative flex justify-center items-center">
          <canvas ref={canvasRef} className="z-10 cursor-pointer" onClick={() => playSynthSound('click')} />
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            {/* Holographic rings */}
            <div className="w-[180px] h-[180px] border border-accentCyan/10 rounded-full animate-pulse" />
            <div className="w-[210px] h-[210px] border border-accentBlue/5 rounded-full animate-ping" />
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Flares Today */}
        <div className="glass-panel p-4 rounded-lg flex flex-col gap-2 relative group hover:border-accentCyan/30 transition-all">
          <div className="flex justify-between items-center text-textMuted">
            <span className="text-3xs font-mono uppercase tracking-wider">Flares Today</span>
            <Activity className="w-4 h-4 text-accentCyan" />
          </div>
          <span className="text-2xl font-bold font-mono text-textPri">04</span>
          <div className="flex justify-between items-end mt-1">
            <span className="text-3xs font-mono text-successGreen">+2 over avg</span>
            <svg className="w-20 h-8 text-accentCyan/40" viewBox="0 0 100 40">
              <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={getLeadTimeSparkline()} />
            </svg>
          </div>
        </div>

        {/* Current Soft X-Ray Flux */}
        <div className="glass-panel p-4 rounded-lg flex flex-col gap-2 relative group hover:border-accentCyan/30 transition-all">
          <div className="flex justify-between items-center text-textMuted">
            <span className="text-3xs font-mono uppercase tracking-wider">Soft X-ray Flux</span>
            <Sun className="w-4 h-4 text-accentCyan" />
          </div>
          <span className="text-2xl font-bold font-mono text-textPri">{currentSoft.toExponential(2)}</span>
          <div className="flex justify-between items-end mt-1">
            <span className="text-3xs font-mono text-textMuted uppercase">SoLEXS 1-8 Å</span>
            <svg className="w-20 h-8 text-accentCyan/40" viewBox="0 0 100 40">
              <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={getSparklineData('soft')} />
            </svg>
          </div>
        </div>

        {/* Current Hard X-Ray Flux */}
        <div className="glass-panel p-4 rounded-lg flex flex-col gap-2 relative group hover:border-accentBlue/30 transition-all">
          <div className="flex justify-between items-center text-textMuted">
            <span className="text-3xs font-mono uppercase tracking-wider">Hard X-ray Flux</span>
            <Zap className="w-4 h-4 text-accentBlue" />
          </div>
          <span className="text-2xl font-bold font-mono text-textPri">{currentHard.toExponential(2)}</span>
          <div className="flex justify-between items-end mt-1">
            <span className="text-3xs font-mono text-textMuted uppercase">HEL1OS 10keV</span>
            <svg className="w-20 h-8 text-accentBlue/40" viewBox="0 0 100 40">
              <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={getSparklineData('hard')} />
            </svg>
          </div>
        </div>

        {/* Current Solar Flare Class */}
        <div className="glass-panel p-4 rounded-lg flex flex-col gap-2 relative group hover:border-accentCyan/30 transition-all">
          <div className="flex justify-between items-center text-textMuted">
            <span className="text-3xs font-mono uppercase tracking-wider">Current Class</span>
            <AlertOctagon className="w-4 h-4 text-accentCyan" />
          </div>
          <span className={`text-2xl font-extrabold font-mono ${currentClass !== 'None' ? 'text-dangerRed glow-text-red animate-pulse' : 'text-successGreen'}`}>
            {currentClass !== 'None' ? `Class ${currentClass}` : 'Quiet'}
          </span>
          <div className="flex justify-between items-end mt-1">
            <span className="text-3xs font-mono text-textMuted uppercase">Classification</span>
            <span className={`text-3xs font-mono ${currentClass !== 'None' ? 'text-dangerRed' : 'text-successGreen'}`}>
              {currentClass !== 'None' ? 'FLARE ACTIVE' : 'NO EVENTS'}
            </span>
          </div>
        </div>

        {/* AI Forecast Accuracy */}
        <div className="glass-panel p-4 rounded-lg flex flex-col gap-2 relative group hover:border-accentCyan/30 transition-all">
          <div className="flex justify-between items-center text-textMuted">
            <span className="text-3xs font-mono uppercase tracking-wider">Model Accuracy</span>
            <Cpu className="w-4 h-4 text-accentCyan" />
          </div>
          <span className="text-2xl font-bold font-mono text-textPri">98.42%</span>
          <div className="flex justify-between items-end mt-1">
            <span className="text-3xs font-mono text-successGreen">Stable F1-Score</span>
            <svg className="w-20 h-8 text-accentCyan/40" viewBox="0 0 100 40">
              <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={getAccuracySparkline()} />
            </svg>
          </div>
        </div>

        {/* Lead Time */}
        <div className="glass-panel p-4 rounded-lg flex flex-col gap-2 relative group hover:border-accentCyan/30 transition-all">
          <div className="flex justify-between items-center text-textMuted">
            <span className="text-3xs font-mono uppercase tracking-wider">Avg Lead Time</span>
            <Clock className="w-4 h-4 text-accentCyan" />
          </div>
          <span className="text-2xl font-bold font-mono text-textPri">18.4m</span>
          <div className="flex justify-between items-end mt-1">
            <span className="text-3xs font-mono text-accentCyan">T-Ahead (max)</span>
            <svg className="w-20 h-8 text-accentCyan/40" viewBox="0 0 100 40">
              <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={getLeadTimeSparkline()} />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Row: Live Logs Feed & System Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Event Feed (takes 2 cols) */}
        <div className="glass-panel p-5 rounded-xl border border-white/10 lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-accentCyan rounded-full animate-ping" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri">Active Telemetry Logs</span>
            </div>
            <span className="text-[10px] text-textMuted font-mono">CHANNEL: DSN-ADITYA-L1-RAW</span>
          </div>

          {/* Event Feed Readout */}
          <div className="h-64 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin">
            {liveEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-2 bg-spaceBgSec/40 border border-white/5 rounded text-xs font-mono hover:bg-spaceBgSec/80 transition-all"
              >
                <span className="text-textMuted text-[10px] select-none mt-0.5">{event.time}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    event.type === 'alert'
                      ? 'bg-dangerRed/20 text-dangerRed border border-dangerRed/30'
                      : event.type === 'warning'
                      ? 'bg-warningAmber/20 text-warningAmber border border-warningAmber/30'
                      : event.type === 'success'
                      ? 'bg-successGreen/20 text-successGreen border border-successGreen/30'
                      : 'bg-accentCyan/15 text-accentCyan border border-accentCyan/20'
                  }`}
                >
                  {event.type}
                </span>
                <p className="text-textSec text-[11px] leading-tight flex-1">{event.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mini Nowcasting Alert / Status Panel (takes 1 col) */}
        <div className="flex flex-col gap-4">
          {activeFlare ? (
            /* Glowing Active Flare Alarm Box */
            <div className="glass-panel-danger p-5 rounded-xl border border-dangerRed/40 flex flex-col justify-between gap-4 animate-alert-blink">
              <div className="flex items-center gap-2 text-dangerRed">
                <AlertOctagon className="w-5 h-5 animate-bounce" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Flare Alarm Active</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-textSec">Classification:</span>
                  <span className="font-extrabold text-dangerRed text-lg glow-text-red">Class {activeFlare.class}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-textSec">Peak X-Ray Flux:</span>
                  <span className="font-bold text-textPri">{activeFlare.peakFlux.toExponential(2)} W/m²</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-textSec">AI Confidence:</span>
                  <span className="font-bold text-textPri">{activeFlare.confidence.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-textSec">Eruption Time:</span>
                  <span className="font-bold text-textPri">{activeFlare.startTime}</span>
                </div>
              </div>
              <div className="p-3 bg-dangerRed/10 border border-dangerRed/20 rounded text-[11px] text-dangerRed font-mono leading-normal">
                Suggested Action: Adjust Earth power grid reactive load factors. Re-route polar satellite telecommunications paths.
              </div>
            </div>
          ) : (
            /* Solar Forecast Prediction Meter */
            <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-textPri block border-b border-white/10 pb-2">
                Heliophysics Prediction
              </span>
              <div className="flex flex-col items-center justify-center py-2 relative">
                {/* Circular indicator container */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="#00E5FF"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={301.6}
                      strokeDashoffset={301.6 - (301.6 * forecast.riskMeter) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold font-mono text-textPri">{forecast.riskMeter}%</span>
                    <span className="text-4xs font-mono text-textMuted uppercase tracking-widest">Risk Factor</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-textSec">Next Predict Lead Time:</span>
                <span className="text-accentCyan font-bold">~{(forecast.leadTime / 60).toFixed(0)}m</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-2xs font-mono mt-1">
                <div className="p-2 bg-spaceBgSec border border-white/5 rounded">
                  <span className="text-textMuted block uppercase">M-Class Prob</span>
                  <span className="text-sm font-bold text-accentBlue mt-0.5 block">{forecast.classM}%</span>
                </div>
                <div className="p-2 bg-spaceBgSec border border-white/5 rounded">
                  <span className="text-textMuted block uppercase">X-Class Prob</span>
                  <span className="text-sm font-bold text-dangerRed mt-0.5 block">{forecast.classX}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
