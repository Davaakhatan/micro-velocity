// Simple script to generate basic sound files using sox
// Run: node scripts/generate-sounds.js

const { execSync } = require('child_process');
const path = require('path');

const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');

console.log('Generating sound files...');

try {
  // Beat sound - low soft click (440Hz, 50ms)
  execSync(`sox -n -r 44100 -c 1 "${soundsDir}/beat.wav" synth 0.05 sine 440 fade 0 0.05 0.01 vol 0.3`);
  console.log('✓ Generated beat.wav');

  // Perfect sound - high success tone (880Hz, 100ms)
  execSync(`sox -n -r 44100 -c 1 "${soundsDir}/perfect.wav" synth 0.1 sine 880 fade 0 0.1 0.02 vol 0.6`);
  console.log('✓ Generated perfect.wav');

  // Good sound - mid tone (660Hz, 80ms)
  execSync(`sox -n -r 44100 -c 1 "${soundsDir}/good.wav" synth 0.08 sine 660 fade 0 0.08 0.02 vol 0.5`);
  console.log('✓ Generated good.wav');

  // Miss sound - low descending tone (200Hz to 100Hz, 100ms)
  execSync(`sox -n -r 44100 -c 1 "${soundsDir}/miss.wav" synth 0.1 sine 200-100 fade 0 0.1 0.02 vol 0.4`);
  console.log('✓ Generated miss.wav');

  console.log('\nAll sound files generated successfully!');
} catch (error) {
  console.error('Error generating sounds. Make sure sox is installed:');
  console.error('  macOS: brew install sox');
  console.error('  Error:', error.message);
  process.exit(1);
}
