import { EqualizerSettings, EqualizerPresetKey } from '../types';

export const EQUALIZER_PRESETS: Record<EqualizerPresetKey, { name: string; desc: string; settings: Omit<EqualizerSettings, 'preset'> }> = {
  flat: {
    name: 'Düz (Doğal)',
    desc: 'Orijinal yayın karakteristiği.',
    settings: { band60: 0, band250: 0, band1k: 0, band4k: 0, band12k: 0, tubeSaturation: 0, stereoWidth: 0, bassBoost: 0 }
  },
  warm_tube: {
    name: '1950s Sıcak Vakum Tüpü',
    desc: 'Dolgun alt frekanslar, sıcak harmonikler ve yumuşak tizler.',
    settings: { band60: 4.5, band250: 3.0, band1k: 1.0, band4k: -1.5, band12k: -3.0, tubeSaturation: 0.65, stereoWidth: 0.2, bassBoost: 0.4 }
  },
  vinyl: {
    name: 'Nostaljik Taş Plak',
    desc: 'Orta frekans odaklı, analog gramofon rezonansı.',
    settings: { band60: 2.0, band250: 4.0, band1k: 3.5, band4k: 1.0, band12k: -5.0, tubeSaturation: 0.5, stereoWidth: 0.1, bassBoost: 0.2 }
  },
  jazz_club: {
    name: 'Canlı Caz Kulübü',
    desc: 'Akustik bas derinliği, parlak nefesli çalgılar ve geniş sahne.',
    settings: { band60: 5.0, band250: 2.0, band1k: 0, band4k: 3.0, band12k: 4.0, tubeSaturation: 0.3, stereoWidth: 0.5, bassBoost: 0.3 }
  },
  bass_boost: {
    name: 'Derin Bas Güçlendirici',
    desc: 'Güçlü alt frekans vuruşları ve zengin gövde.',
    settings: { band60: 8.0, band250: 5.0, band1k: -1.0, band4k: 1.0, band12k: 2.0, tubeSaturation: 0.2, stereoWidth: 0.15, bassBoost: 0.8 }
  },
  vocal_clarity: {
    name: 'Berrak Vokal & Spiker',
    desc: 'Konuşma ve vokal netliğini öne çıkaran akustik ayar.',
    settings: { band60: -3.0, band250: 1.0, band1k: 4.5, band4k: 4.0, band12k: 2.0, tubeSaturation: 0.1, stereoWidth: 0.1, bassBoost: 0 }
  },
  acoustic: {
    name: 'Akustik Ahşap Kabin',
    desc: 'Doğal tel ve ahşap rezonansı, dengeli dinamik aralık.',
    settings: { band60: 3.0, band250: 2.0, band1k: -1.0, band4k: 2.5, band12k: 3.5, tubeSaturation: 0.25, stereoWidth: 0.3, bassBoost: 0.15 }
  },
  night_mode: {
    name: 'Gece Dinleme (Yumuşak)',
    desc: 'Kulak yormayan yumuşak baslar ve kısık parlaklık.',
    settings: { band60: -2.0, band250: 0, band1k: 1.0, band4k: -2.0, band12k: -4.5, tubeSaturation: 0.1, stereoWidth: 0, bassBoost: 0 }
  }
};

class VintageAudioEngine {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  
  // Equalizer Filters
  private filter60: BiquadFilterNode | null = null;
  private filter250: BiquadFilterNode | null = null;
  private filter1k: BiquadFilterNode | null = null;
  private filter4k: BiquadFilterNode | null = null;
  private filter12k: BiquadFilterNode | null = null;
  
  // Tube Warmth Saturation Waveshaper & Gain
  private waveshaper: WaveShaperNode | null = null;
  private tubeMixGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  
  // Master & Analyser
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  
  // Static Noise Generator
  private staticGainNode: GainNode | null = null;
  private staticFilterNode: BiquadFilterNode | null = null;
  private staticSource: AudioBufferSourceNode | null = null;
  private isStaticRunning = false;

  // Recording
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private recordingStartTime = 0;
  private isRecording = false;

  private isInitialized = false;

  public init(audioEl: HTMLAudioElement) {
    if (this.isInitialized && this.audioElement === audioEl) return;
    
    this.audioElement = audioEl;
    this.audioElement.crossOrigin = 'anonymous';

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Create Analyser
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;

      // EQ Filters
      this.filter60 = this.ctx.createBiquadFilter();
      this.filter60.type = 'lowshelf';
      this.filter60.frequency.value = 60;
      this.filter60.gain.value = 0;

      this.filter250 = this.ctx.createBiquadFilter();
      this.filter250.type = 'peaking';
      this.filter250.frequency.value = 250;
      this.filter250.Q.value = 1.0;
      this.filter250.gain.value = 0;

      this.filter1k = this.ctx.createBiquadFilter();
      this.filter1k.type = 'peaking';
      this.filter1k.frequency.value = 1000;
      this.filter1k.Q.value = 1.0;
      this.filter1k.gain.value = 0;

      this.filter4k = this.ctx.createBiquadFilter();
      this.filter4k.type = 'peaking';
      this.filter4k.frequency.value = 4000;
      this.filter4k.Q.value = 1.0;
      this.filter4k.gain.value = 0;

      this.filter12k = this.ctx.createBiquadFilter();
      this.filter12k.type = 'highshelf';
      this.filter12k.frequency.value = 12000;
      this.filter12k.gain.value = 0;

      // Tube Saturation WaveShaper
      this.waveshaper = this.ctx.createWaveShaper();
      this.waveshaper.curve = this.makeTubeCurve(25);
      this.waveshaper.oversample = '4x';

      this.tubeMixGain = this.ctx.createGain();
      this.tubeMixGain.gain.value = 0.2;

      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.value = 0.8;

      // Media Destination for offline recording
      this.destinationNode = this.ctx.createMediaStreamDestination();

      // Connect source to filters
      try {
        this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
      } catch (err) {
        console.warn('MediaElementSource already created or CORS restricted:', err);
      }

      if (this.sourceNode) {
        // Chain: source -> filter60 -> filter250 -> filter1k -> filter4k -> filter12k
        this.sourceNode.connect(this.filter60);
        this.filter60.connect(this.filter250);
        this.filter250.connect(this.filter1k);
        this.filter1k.connect(this.filter4k);
        this.filter4k.connect(this.filter12k);

        // Split to dry & tube saturation
        this.filter12k.connect(this.dryGain);
        this.filter12k.connect(this.waveshaper);
        this.waveshaper.connect(this.tubeMixGain);

        // Merge to master
        this.dryGain.connect(this.masterGain);
        this.tubeMixGain.connect(this.masterGain);

        // Master connects to analyser, destination recorder and hardware output
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.masterGain.connect(this.destinationNode);
      }

      // Prepare Static Noise generator
      this.setupStaticGenerator();

      this.isInitialized = true;
    } catch (e) {
      console.error('AudioContext initialization error:', e);
    }
  }

  public async resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  private makeTubeCurve(amount: number = 20): Float32Array {
    const k = typeof amount === 'number' ? amount : 20;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      // Asymmetric saturation curve for authentic tube even & odd harmonic warmth
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x)) + (0.05 * Math.sin(x * Math.PI));
    }
    return curve;
  }

  private setupStaticGenerator() {
    if (!this.ctx) return;
    
    // Create static gain and bandpass filter to sound like analog AM/FM airwave hiss
    this.staticGainNode = this.ctx.createGain();
    this.staticGainNode.gain.value = 0.0;

    this.staticFilterNode = this.ctx.createBiquadFilter();
    this.staticFilterNode.type = 'bandpass';
    this.staticFilterNode.frequency.value = 1400;
    this.staticFilterNode.Q.value = 1.2;

    this.staticFilterNode.connect(this.staticGainNode);
    this.staticGainNode.connect(this.ctx.destination);
  }

  public startStaticNoise(staticVolume: number = 0.15) {
    if (!this.ctx || this.isStaticRunning) return;
    try {
      // Generate 4-second loopable vintage radio crackle buffer
      const bufferSize = this.ctx.sampleRate * 3;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink / Brownian noise mix for deep airwave static
        const brown = (lastOut + (0.02 * white)) / 1.02;
        lastOut = brown;
        // Random micro pops
        const pop = Math.random() > 0.9992 ? (Math.random() * 0.8 - 0.4) : 0;
        output[i] = (brown * 3.5 * 0.5 + white * 0.2 + pop) * 0.25;
      }

      this.staticSource = this.ctx.createBufferSource();
      this.staticSource.buffer = noiseBuffer;
      this.staticSource.loop = true;

      if (this.staticFilterNode) {
        this.staticSource.connect(this.staticFilterNode);
      }

      this.staticSource.start(0);
      this.isStaticRunning = true;
      this.setStaticNoiseLevel(staticVolume);
    } catch (err) {
      console.warn('Could not start static noise:', err);
    }
  }

  public setStaticNoiseLevel(targetGain: number) {
    if (this.staticGainNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.staticGainNode.gain.cancelScheduledValues(now);
      this.staticGainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, targetGain)), now, 0.08);
    }
  }

  public stopStaticNoise() {
    if (this.staticSource && this.isStaticRunning) {
      try {
        this.setStaticNoiseLevel(0);
        setTimeout(() => {
          if (this.staticSource) {
            this.staticSource.stop();
            this.staticSource.disconnect();
            this.staticSource = null;
          }
          this.isStaticRunning = false;
        }, 150);
      } catch {
        this.isStaticRunning = false;
      }
    }
  }

  public applyEqualizer(eq: EqualizerSettings) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.filter60) this.filter60.gain.setTargetAtTime(eq.band60 + (eq.bassBoost * 6), now, 0.05);
    if (this.filter250) this.filter250.gain.setTargetAtTime(eq.band250, now, 0.05);
    if (this.filter1k) this.filter1k.gain.setTargetAtTime(eq.band1k, now, 0.05);
    if (this.filter4k) this.filter4k.gain.setTargetAtTime(eq.band4k, now, 0.05);
    if (this.filter12k) this.filter12k.gain.setTargetAtTime(eq.band12k, now, 0.05);

    if (this.tubeMixGain && this.dryGain) {
      const sat = Math.max(0, Math.min(1, eq.tubeSaturation));
      this.tubeMixGain.gain.setTargetAtTime(sat * 0.7, now, 0.05);
      this.dryGain.gain.setTargetAtTime(1.0 - sat * 0.3, now, 0.05);
    }
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.03);
    }
  }

  public fadeOutAndStop(durationSeconds: number = 30, onComplete?: () => void) {
    if (!this.masterGain || !this.ctx || !this.audioElement) {
      onComplete?.();
      return;
    }
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

    setTimeout(() => {
      if (this.audioElement) {
        this.audioElement.pause();
        this.setMasterVolume(1.0); // reset volume back
      }
      onComplete?.();
    }, durationSeconds * 1000);
  }

  public getAudioMetrics(): { vuLevel: number; vuLeft: number; vuRight: number; frequencyData: Uint8Array } {
    if (!this.analyser) {
      return { vuLevel: 0, vuLeft: 0, vuRight: 0, frequencyData: new Uint8Array(32) };
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    let sumLow = 0;
    let sumHigh = 0;
    const half = Math.floor(bufferLength / 2);

    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
      if (i < half) sumLow += dataArray[i];
      else sumHigh += dataArray[i];
    }

    const avg = sum / bufferLength / 255; // 0 to 1
    const avgLow = sumLow / half / 255;
    const avgHigh = sumHigh / (bufferLength - half) / 255;

    return {
      vuLevel: avg,
      vuLeft: Math.min(1, avgLow * 1.2),
      vuRight: Math.min(1, avgHigh * 1.15),
      frequencyData: dataArray
    };
  }

  // --- STREAM AUDIO RECORDER FOR OFFLINE LISTENING ---
  public startRecording(): boolean {
    if (!this.destinationNode || !this.ctx) return false;
    try {
      this.recordedChunks = [];
      const stream = this.destinationNode.stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      this.mediaRecorder = new MediaRecorder(stream, { mimeType });
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.recordingStartTime = Date.now();
      this.isRecording = true;
      this.mediaRecorder.start(250); // Slice every 250ms
      return true;
    } catch (err) {
      console.error('Failed to start stream recorder:', err);
      return false;
    }
  }

  public stopRecording(): Promise<{ blob: Blob; durationSeconds: number } | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecording) {
        resolve(null);
        return;
      }

      const duration = Math.max(1, Math.round((Date.now() - this.recordingStartTime) / 1000));
      this.isRecording = false;

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordedChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        this.recordedChunks = [];
        resolve({ blob: audioBlob, durationSeconds: duration });
      };

      try {
        this.mediaRecorder.stop();
      } catch {
        resolve(null);
      }
    });
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}

export const audioEngine = new VintageAudioEngine();
