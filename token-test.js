// Simple script to test if the GitHub token is working
require('dotenv').config();

const token = process.env.VITE_GITHUB_TOKEN;

console.log('Token check:');
console.log('Token exists:', !!token);
console.log('Token length:', token ? token.length : 0);
console.log('Token format check:', token && token.startsWith('ghp_') ? 'Valid format' : 'Invalid format');

// Make a test request to GitHub API
const https = require('https');

const options = {
  hostname: 'api.github.com',
  path: '/user',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js',
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      const userData = JSON.parse(data);
      console.log('Authentication successful!');
      console.log('Authenticated as:', userData.login);
      console.log('User ID:', userData.id);
    } else {
      console.log('Authentication failed!');
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
