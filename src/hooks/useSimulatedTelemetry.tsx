import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Type definitions for our telemetry system
export interface FluxData {
  time: string;
  soft: number; // SoLEXS 1-8 Å
  hard: number; // HEL1OS 10-150 keV
  combined: number;
}

export interface SatelliteSubsystems {
  communication: 'NOMINAL' | 'DEGRADED' | 'OFFLINE';
  payloadHealth: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  solexsStatus: 'ACTIVE' | 'CALIBRATING' | 'STANDBY';
  hel1osStatus: 'ACTIVE' | 'CALIBRATING' | 'STANDBY';
  powerLevel: number; // percentage
  temperature: number; // °C
  orbitDeviation: number; // meters
}

export interface LiveEvent {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
}

export interface ActiveFlare {
  detected: boolean;
  class: 'A' | 'B' | 'C' | 'M' | 'X' | 'None';
  confidence: number;
  peakFlux: number;
  startTime: string;
  duration: number; // seconds
  countdown: number; // seconds remaining
}

export interface ForecastState {
  classM: number; // probability 0-100
  classX: number; // probability 0-100
  confidence: number; // AI confidence 0-100
  leadTime: number; // seconds
  riskMeter: number; // 0-100
}

interface TelemetryContextType {
  fluxHistory: FluxData[];
  currentSoft: number;
  currentHard: number;
  currentClass: 'A' | 'B' | 'C' | 'M' | 'X' | 'None';
  subsystems: SatelliteSubsystems;
  liveEvents: LiveEvent[];
  activeFlare: ActiveFlare | null;
  forecast: ForecastState;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  triggerManualFlare: (flareClass: 'C' | 'M' | 'X') => void;
  clearHistory: () => void;
  soundAlertTriggered: boolean;
  setSoundAlertTriggered: (val: boolean) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [fluxHistory, setFluxHistory] = useState<FluxData[]>([]);
  const [currentSoft, setCurrentSoft] = useState<number>(1.2e-6);
  const [currentHard, setCurrentHard] = useState<number>(2.5e-7);
  const [currentClass, setCurrentClass] = useState<'A' | 'B' | 'C' | 'M' | 'X' | 'None'>('None');
  const [soundAlertTriggered, setSoundAlertTriggered] = useState<boolean>(false);

  // Subsystem telemetry values
  const [subsystems, setSubsystems] = useState<SatelliteSubsystems>({
    communication: 'NOMINAL',
    payloadHealth: 'NOMINAL',
    solexsStatus: 'ACTIVE',
    hel1osStatus: 'ACTIVE',
    powerLevel: 98.4,
    temperature: 24.2,
    orbitDeviation: 0.12,
  });

  // Forecasting details
  const [forecast, setForecast] = useState<ForecastState>({
    classM: 32,
    classX: 8,
    confidence: 89.4,
    leadTime: 1240,
    riskMeter: 35,
  });

  // Active flare state
  const [activeFlare, setActiveFlare] = useState<ActiveFlare | null>(null);

  // Live events feed log
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([
    { id: '1', time: '20:01:05', message: 'System Boot Sequence Completed Successfully', type: 'success' },
    { id: '2', time: '20:02:12', message: 'Payload SoLEXS calibration verified', type: 'info' },
    { id: '3', time: '20:03:00', message: 'HEL1OS detector status updated: NOMINAL', type: 'info' },
  ]);

  // Ref tracking flare variables
  const flareRef = useRef<{
    class: 'C' | 'M' | 'X';
    peakFlux: number;
    duration: number;
    elapsed: number;
    phase: 'precursor' | 'peak' | 'decay';
  } | null>(null);

  // Initialize historical data
  useEffect(() => {
    const initialData: FluxData[] = [];
    const now = new Date();
    for (let i = 40; i >= 0; i--) {
      const timeStr = new Date(now.getTime() - i * 3000).toLocaleTimeString([], { hour12: false });
      const softVal = 1.0e-6 + Math.random() * 0.4e-6;
      const hardVal = 2.0e-7 + Math.random() * 0.8e-7;
      initialData.push({
        time: timeStr,
        soft: softVal,
        hard: hardVal,
        combined: softVal + hardVal,
      });
    }
    setFluxHistory(initialData);
  }, []);

  const addEvent = (message: string, type: 'info' | 'warning' | 'alert' | 'success') => {
    const timeStr = new Date().toLocaleTimeString([], { hour12: false });
    setLiveEvents(prev => [
      { id: Date.now().toString(), time: timeStr, message, type },
      ...prev.slice(0, 49), // Keep last 50 events
    ]);
  };

  const triggerManualFlare = (flareClass: 'C' | 'M' | 'X') => {
    if (flareRef.current) {
      addEvent(`Unable to trigger ${flareClass}-class flare: Solar event is already active.`, 'warning');
      return;
    }

    let peak = 9e-6;
    let dur = 30; // 30 ticks
    if (flareClass === 'M') {
      peak = 4.5e-5;
      dur = 45;
    } else if (flareClass === 'X') {
      peak = 1.8e-4;
      dur = 60;
    }

    flareRef.current = {
      class: flareClass,
      peakFlux: peak,
      duration: dur,
      elapsed: 0,
      phase: 'precursor',
    };

    setActiveFlare({
      detected: true,
      class: flareClass,
      confidence: 94.8 + Math.random() * 4,
      peakFlux: peak,
      startTime: new Date().toLocaleTimeString([], { hour12: false }),
      duration: dur,
      countdown: dur,
    });

    setSoundAlertTriggered(true);
    addEvent(`CRITICAL: Pre-flare signature detected! Triggering class ${flareClass} Solar Event alerts.`, 'alert');
  };

  const clearHistory = () => {
    setFluxHistory([]);
    addEvent('Telemetry history cleared.', 'info');
  };

  // Main simulation tick loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour12: false });
      let softVal = 1.0e-6 + Math.random() * 0.4e-6;
      let hardVal = 2.0e-7 + Math.random() * 0.8e-7;
      let computedClass: 'A' | 'B' | 'C' | 'M' | 'X' | 'None' = 'None';

      // Telemetry fluctuation
      setSubsystems(prev => {
        const tempDelta = (Math.random() - 0.5) * 0.2;
        const powerDelta = (Math.random() - 0.5) * 0.1;
        return {
          ...prev,
          temperature: Math.max(20, Math.min(30, Number((prev.temperature + tempDelta).toFixed(2)))),
          powerLevel: Math.max(90, Math.min(100, Number((prev.powerLevel + powerDelta).toFixed(2)))),
          orbitDeviation: Math.max(0.01, Math.min(2.5, Number((prev.orbitDeviation + (Math.random() - 0.5) * 0.05).toFixed(3)))),
        };
      });

      // Handle active flare mathematical simulation
      if (flareRef.current) {
        const flare = flareRef.current;
        flare.elapsed += 1;

        const progress = flare.elapsed / flare.duration;

        // Flare phases: Precursor (0-20%), Peak (20-40%), Decay (40-100%)
        if (progress < 0.2) {
          flare.phase = 'precursor';
          const t = progress / 0.2;
          softVal += flare.peakFlux * 0.15 * t;
          hardVal += flare.peakFlux * 0.08 * t;
        } else if (progress < 0.4) {
          if (flare.phase !== 'peak') {
            flare.phase = 'peak';
            addEvent(`ALERT: Class ${flare.class} Solar Flare Peak Phase registered by SoLEXS.`, 'alert');
          }
          const t = (progress - 0.2) / 0.2; // 0 to 1
          softVal += flare.peakFlux * 0.15 + (flare.peakFlux * 0.85) * Math.sin(t * Math.PI / 2);
          hardVal += flare.peakFlux * 0.08 + (flare.peakFlux * 0.92) * Math.sin(t * Math.PI / 2);
        } else {
          flare.phase = 'decay';
          const t = (progress - 0.4) / 0.6; // 0 to 1
          const decayCoeff = Math.exp(-t * 3.5); // exponential decay
          softVal += flare.peakFlux * decayCoeff;
          hardVal += flare.peakFlux * decayCoeff;
        }

        // Determine class based on peak flux level (W/m^2)
        // A < 1e-8, B < 1e-7, C < 1e-6, M < 1e-5, X >= 1e-4
        if (softVal >= 1e-4) computedClass = 'X';
        else if (softVal >= 1e-5) computedClass = 'M';
        else if (softVal >= 1e-6) computedClass = 'C';
        else if (softVal >= 1e-7) computedClass = 'B';
        else computedClass = 'A';

        // Update active flare countdown state
        setActiveFlare(prev => {
          if (!prev) return null;
          return {
            ...prev,
            countdown: Math.max(0, flare.duration - flare.elapsed),
            peakFlux: Math.max(prev.peakFlux, softVal),
            class: computedClass,
          };
        });

        // Terminate flare simulation at duration limit
        if (flare.elapsed >= flare.duration) {
          addEvent(`Solar flare class ${flare.class} event concluded. System returning to standby.`, 'success');
          flareRef.current = null;
          setActiveFlare(null);
          setSoundAlertTriggered(false);
          // Set quiet state forecasts
          setForecast(prev => ({
            ...prev,
            classM: 10 + Math.floor(Math.random() * 15),
            classX: 2 + Math.floor(Math.random() * 5),
            riskMeter: 12 + Math.floor(Math.random() * 10),
            leadTime: 1800 + Math.floor(Math.random() * 600),
          }));
        }
      } else {
        // Quiet state fluctuations
        // Add random pre-flare alerts
        if (Math.random() < 0.015) {
          const classes: ('C' | 'M' | 'X')[] = ['C', 'C', 'C', 'M', 'M', 'X'];
          const randomClass = classes[Math.floor(Math.random() * classes.length)];
          triggerManualFlare(randomClass);
        }

        // Fluctuations in AI forecasts
        setForecast(prev => {
          const deltaM = (Math.random() - 0.5) * 2;
          const deltaX = (Math.random() - 0.5) * 0.5;
          const newM = Math.max(5, Math.min(95, Number((prev.classM + deltaM).toFixed(1))));
          const newX = Math.max(1, Math.min(50, Number((prev.classX + deltaX).toFixed(1))));
          return {
            ...prev,
            classM: newM,
            classX: newX,
            riskMeter: Math.max(10, Math.min(98, Math.floor(newM * 0.8 + newX * 1.5))),
            confidence: Math.max(80, Math.min(99.8, Number((88 + Math.random() * 11).toFixed(2)))),
            leadTime: Math.max(100, prev.leadTime - (isPlaying ? 1 : 0)),
          };
        });
      }

      setCurrentSoft(softVal);
      setCurrentHard(hardVal);
      setCurrentClass(computedClass);

      // Packet feed updates
      if (Math.random() < 0.15 && !flareRef.current) {
        const packets = [
          'Raw X-ray Telemetry stream matching baseline standards.',
          'Atmospheric absorption corrections integrated.',
          'Model inference updated: Active Region AR3312 steady.',
          'Communication signal SNR at 42.1 dB (nominal).',
          'Lagrange L1 orbital vector verified via payload beacons.',
        ];
        addEvent(packets[Math.floor(Math.random() * packets.length)], 'info');
      }

      setFluxHistory(prev => {
        const nextData = [
          ...prev,
          {
            time: timeStr,
            soft: softVal,
            hard: hardVal,
            combined: softVal + hardVal,
          },
        ];
        return nextData.slice(-100); // Keep last 100 entries
      });
    }, 1000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, simulationSpeed]);

  return (
    <TelemetryContext.Provider
      value={{
        fluxHistory,
        currentSoft,
        currentHard,
        currentClass,
        subsystems,
        liveEvents,
        activeFlare,
        forecast,
        isPlaying,
        setIsPlaying,
        simulationSpeed,
        setSimulationSpeed,
        triggerManualFlare,
        clearHistory,
        soundAlertTriggered,
        setSoundAlertTriggered,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
