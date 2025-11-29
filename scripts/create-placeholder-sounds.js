// Create minimal WAV files as placeholders
// These are ultra-simple 1-sample WAV files that will work but sound very basic
// Replace with proper sounds later

const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');

// Ensure directory exists
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Create a minimal WAV file (44.1kHz, 16-bit, mono)
function createSimpleWav(filename, durationMs, frequency) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationMs / 1000);
  const numChannels = 1;
  const bitsPerSample = 16;

  // WAV header (44 bytes)
  const header = Buffer.alloc(44);

  // RIFF header
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + numSamples * 2, 4); // File size - 8
  header.write('WAVE', 8);

  // fmt chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk size
  header.writeUInt16LE(1, 20); // Audio format (1 = PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28); // Byte rate
  header.writeUInt16LE(numChannels * bitsPerSample / 8, 32); // Block align
  header.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  header.write('data', 36);
  header.writeUInt32LE(numSamples * 2, 40);

  // Generate sine wave samples
  const samples = Buffer.alloc(numSamples * 2);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.min(1, (numSamples - i) / (sampleRate * 0.02)); // Fade out
    const value = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3 * 32767;
    samples.writeInt16LE(Math.floor(value), i * 2);
  }

  const wav = Buffer.concat([header, samples]);
  fs.writeFileSync(path.join(soundsDir, filename), wav);
}

console.log('Creating placeholder sound files...');

createSimpleWav('beat.wav', 50, 440);
console.log('✓ Created beat.wav');

createSimpleWav('perfect.wav', 100, 880);
console.log('✓ Created perfect.wav');

createSimpleWav('good.wav', 80, 660);
console.log('✓ Created good.wav');

createSimpleWav('miss.wav', 100, 200);
console.log('✓ Created miss.wav');

console.log('\nPlaceholder sound files created!');
console.log('Note: These are basic synthesized tones. Replace with proper sound assets for production.');
