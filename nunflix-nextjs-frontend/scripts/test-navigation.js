#!/usr/bin/env node
/**
 * Nunflix Navigation Link Tester
 * 
 * This script tests all navigation links in the Nunflix application
 * to verify they return valid responses before manual click-through testing.
 * 
 * Usage:
 *   node scripts/test-navigation.js [--base-url https://example.com]
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const { exec } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const baseUrlArg = args.find(arg => arg.startsWith('--base-url='));
const baseUrl = baseUrlArg 
  ? baseUrlArg.split('=')[1] 
  : 'http://localhost:3000';

console.log(`🔍 Testing Nunflix navigation links against: ${baseUrl}\n`);

// Define all navigation paths from our components
const navigationPaths = [
  // Home
  '/',
  
  // Movies section
  '/movies',
  '/movies/trending',
  '/movies/popular',
  '/movies/top_rated',
  '/movies/marvel',
  '/movies/dc',
  '/movies/paramount',
  '/movies/disney',
  '/movies/most_viewed',
  
  // Shows section
  '/tv',
  '/shows/popular',
  '/shows/top_rated',
  '/shows/netflix',
  '/shows/hbo',
  '/shows/apple_tv+',
  '/shows/prime_video',
  '/shows/shahid_vip',
  '/shows/starz_play',
  '/shows/hulu',
  
  // Streaming section
  '/streaming/netflix',
  '/streaming/disney+',
  '/streaming/hbo_max',
  '/streaming/apple_tv+',
  '/streaming/prime_video',
  '/streaming/shahid_vip',
  '/streaming/starz_play',
  '/streaming/hulu',
  
  // Discover section
  '/discover',
  '/discover?genre=anime',
  '/discover?sort=vote_average.desc',
  '/discover?sort=popularity.desc',
  '/discover?collection=marvel',
  '/discover?collection=dc',
  '/discover?sort=views.desc',
  
  // Profile section
  '/profile',
  '/profile?tab=watchlist',
  
  // Search
  '/search?q=test',
  
  // Misc
  '/robots.txt',
  '/api/sitemap.xml',
];

// Results tracking
const results = {
  success: [],
  notFound: [],
  error: [],
  redirect: []
};

// Make HTTP request to a path
function testPath(path) {
  return new Promise((resolve) => {
    const fullUrl = new URL(path, baseUrl);
    const client = fullUrl.protocol === 'https:' ? https : http;
    
    const req = client.get(fullUrl.toString(), (res) => {
      const { statusCode } = res;
      
      // Handle different status codes
      if (statusCode >= 200 && statusCode < 300) {
        results.success.push({ path, statusCode });
      } else if (statusCode === 404) {
        results.notFound.push({ path, statusCode });
      } else if (statusCode >= 300 && statusCode < 400) {
        let redirectLocation = res.headers.location || 'unknown';
        results.redirect.push({ path, statusCode, redirectLocation });
      } else {
        results.error.push({ path, statusCode });
      }
      
      resolve();
    });
    
    req.on('error', (error) => {
      results.error.push({ path, error: error.message });
      resolve();
    });
    
    // Set a timeout
    req.setTimeout(10000, () => {
      req.destroy(new Error('Request timeout'));
      results.error.push({ path, error: 'Request timeout' });
      resolve();
    });
  });
}

// Check if dev server is running
function checkDevServer() {
  return new Promise((resolve) => {
    const testUrl = new URL('/', baseUrl);
    const client = testUrl.protocol === 'https:' ? https : http;
    
    const req = client.get(testUrl.toString(), () => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Start dev server if needed
function startDevServer() {
  return new Promise((resolve) => {
    console.log('🚀 Starting development server...');
    
    const devProcess = exec('cd nunflix-nextjs-frontend && npm run dev', 
      { maxBuffer: 1024 * 1024 * 10 });
    
    // Wait for server to start
    let output = '';
    devProcess.stdout.on('data', (data) => {
      output += data.toString();
      // Look for indication server is ready
      if (output.includes('ready') || output.includes('started')) {
        console.log('✅ Development server started');
        resolve(devProcess);
      }
    });
    
    // Handle timeout
    setTimeout(() => {
      if (!output.includes('ready') && !output.includes('started')) {
        console.log('⚠️ Timeout waiting for dev server to start, proceeding anyway');
        resolve(devProcess);
      }
    }, 20000);
  });
}

// Print results in a nice format
function printResults() {
  console.log('\n====== NAVIGATION TEST RESULTS ======');
  
  console.log(`\n✅ SUCCESSFUL (${results.success.length}/${navigationPaths.length}):`);
  results.success.forEach(item => {
    console.log(`  ${item.statusCode} - ${item.path}`);
  });
  
  if (results.redirect.length > 0) {
    console.log(`\n↪️ REDIRECTS (${results.redirect.length}):`);
    results.redirect.forEach(item => {
      console.log(`  ${item.statusCode} - ${item.path} → ${item.redirectLocation}`);
    });
  }
  
  if (results.notFound.length > 0) {
    console.log(`\n❌ NOT FOUND (${results.notFound.length}):`);
    results.notFound.forEach(item => {
      console.log(`  ${item.statusCode} - ${item.path}`);
    });
  }
  
  if (results.error.length > 0) {
    console.log(`\n⚠️ ERRORS (${results.error.length}):`);
    results.error.forEach(item => {
      console.log(`  ${item.error || item.statusCode} - ${item.path}`);
    });
  }
  
  // Summary
  console.log('\n====== SUMMARY ======');
  console.log(`Total Links: ${navigationPaths.length}`);
  console.log(`Success: ${results.success.length}`);
  console.log(`Redirects: ${results.redirect.length}`);
  console.log(`Not Found: ${results.notFound.length}`);
  console.log(`Errors: ${results.error.length}`);
  
  // Exit code based on results
  if (results.notFound.length > 0 || results.error.length > 0) {
    console.log('\n⚠️ Some navigation links are not working properly!');
    return 1;
  } else {
    console.log('\n✅ All navigation links are working properly!');
    return 0;
  }
}

// Main execution
async function main() {
  // Check if server is running
  const isServerRunning = await checkDevServer();
  let devProcess = null;
  
  if (!isServerRunning && baseUrl.includes('localhost')) {
    devProcess = await startDevServer();
    // Give the server a moment to fully initialize
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log(`🔄 Testing ${navigationPaths.length} navigation paths...`);
  
  // Test all paths in sequence to avoid overwhelming the server
  for (const path of navigationPaths) {
    process.stdout.write(`  Testing ${path}... `);
    await testPath(path);
    
    // Determine the last result for this path
    const lastResult = [...results.success, ...results.notFound, ...results.redirect, ...results.error]
      .find(r => r.path === path);
      
    if (results.success.some(r => r.path === path)) {
      process.stdout.write('✅\n');
    } else if (results.redirect.some(r => r.path === path)) {
      process.stdout.write(`↪️ (${lastResult.statusCode})\n`);
    } else if (results.notFound.some(r => r.path === path)) {
      process.stdout.write(`❌ (404)\n`);
    } else {
      process.stdout.write(`⚠️ (${lastResult.error || lastResult.statusCode})\n`);
    }
  }
  
  // Print final results
  const exitCode = printResults();
  
  // Clean up dev server if we started it
  if (devProcess) {
    console.log('\nShutting down development server...');
    devProcess.kill();
  }
  
  process.exit(exitCode);
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
