// Procedural Web Audio Ambient Soundscapes Generator
// Generates gentle rain, ocean waves, and forest wind with zero external audio assets!

let audioCtx = null;
let currentSource = null;
let currentGain = null;
let activeSoundType = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playAmbientSound(type = 'rain', volume = 0.15) {
  stopAmbientSound();

  const ctx = getAudioContext();
  if (!ctx) return;

  activeSoundType = type;

  // Create 5-second looping white noise buffer
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with pink/brown smoothed noise for gentle sounds
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();

  if (type === 'rain') {
    // Gentle rain: lowpass with subtle high sparkle
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume * 0.8, ctx.currentTime);
  } else if (type === 'ocean') {
    // Ocean waves: deeply filtered brown noise with oscillating LFO
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    // LFO for wave swelling
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime); // Wave every ~6 seconds
    lfoGain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
    lfo.connect(gainNode.gain);
    lfo.start();
  } else if (type === 'forest') {
    // Forest breeze: soft warm lowpass
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
  }

  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noiseSource.start();

  currentSource = noiseSource;
  currentGain = gainNode;
}

export function stopAmbientSound() {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch (e) {}
    currentSource = null;
  }
  activeSoundType = null;
}

export function getActiveAmbientType() {
  return activeSoundType;
}
