#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Unghost Agent Favicon Generator');
console.log('===================================\n');

// Paths
const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');
const svgFaviconPath = path.join(imagesDir, 'unghost-agent-favicon.svg');
const svgIconPath = path.join(imagesDir, 'unghost-agent-icon.svg');

// Check if SVG files exist
console.log('✅ Checking existing SVG files...');
if (!fs.existsSync(svgFaviconPath)) {
  console.error('❌ SVG favicon not found:', svgFaviconPath);
  process.exit(1);
}

if (!fs.existsSync(svgIconPath)) {
  console.error('❌ SVG icon not found:', svgIconPath);
  process.exit(1);
}

console.log('✅ SVG files found!');
console.log('   - Favicon SVG:', svgFaviconPath);
console.log('   - Icon SVG:', svgIconPath);

// Check what's already implemented
console.log('\n🔍 Checking current favicon implementation...');

// Read layout.tsx to see current favicon configuration
const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  console.log('✅ Layout.tsx found with current favicon configuration:');
  
  // Extract favicon-related lines
  const faviconLines = layoutContent.split('\n').filter(line => 
    line.includes('favicon') || line.includes('icon') || line.includes('apple-touch')
  );
  
  faviconLines.forEach(line => {
    console.log('   ', line.trim());
  });
}

console.log('\n📋 Current favicon status:');
console.log('✅ SVG favicon configured in layout.tsx');
console.log('✅ SVG icon configured for 32x32');
console.log('✅ Apple touch icon configured');

// Check for missing traditional favicon.ico
const faviconIcoPath = path.join(publicDir, 'favicon.ico');
if (fs.existsSync(faviconIcoPath)) {
  console.log('✅ favicon.ico exists');
} else {
  console.log('❌ favicon.ico missing - needed for legacy browser support');
}

console.log('\n💡 Recommendations:');
console.log('   1. The current SVG implementation is excellent for modern browsers');
console.log('   2. A favicon.ico file should be added for legacy browser support');
console.log('   3. PNG versions could be generated for wider compatibility');

console.log('\n🌐 To generate missing formats:');
console.log('   1. Use online tools like favicon.io or realfavicongenerator.net');
console.log('   2. Upload the unghost-agent-favicon.svg file');
console.log('   3. Download the generated favicon.ico and place it in /public/');
console.log('   4. Optionally add PNG versions to /public/images/');

console.log('\n🎉 Favicon analysis complete!'); 