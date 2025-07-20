#!/usr/bin/env node

// Simple startup script for Railway deployment
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Gaslytics Backend Server...');

// Try to use tsx if available, otherwise use node with compiled JS
const serverPath = join(__dirname, 'src', 'server.ts');
const distPath = join(__dirname, 'dist', 'server.js');

// Check if tsx is available
const tsxCheck = spawn('which', ['tsx'], { stdio: 'pipe' });

tsxCheck.on('close', (code) => {
  if (code === 0) {
    // tsx is available, use it
    console.log('✅ Using tsx to run TypeScript directly');
    const server = spawn('tsx', [serverPath], { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    
    server.on('error', (err) => {
      console.error('❌ Failed to start server with tsx:', err);
      process.exit(1);
    });
  } else {
    // tsx not available, try compiled JS
    console.log('⚠️ tsx not found, trying compiled JavaScript...');
    const server = spawn('node', [distPath], { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    
    server.on('error', (err) => {
      console.error('❌ Failed to start server with node:', err);
      console.error('Please ensure TypeScript is compiled or tsx is installed');
      process.exit(1);
    });
  }
});

tsxCheck.on('error', () => {
  console.log('⚠️ Could not check for tsx, trying compiled JavaScript...');
  const server = spawn('node', [distPath], { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  server.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
}); 