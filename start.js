// start.js
const { exec } = require('child_process');
const path = require('path');

// Function to run a command in a given directory
function runCommand(command, directory) {
  return new Promise((resolve, reject) => {
    const options = { cwd: directory };

    const process = exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command in ${directory}: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr from ${directory}: ${stderr}`);
      }
      console.log(`stdout from ${directory}: ${stdout}`);
      resolve();
    });

    process.stdout.pipe(process.stdout);
    process.stderr.pipe(process.stderr);
  });
}

// Paths to the backend and frontend directories
const backendDir = path.join(__dirname, 'JP-backend');
const frontendDir = path.join(__dirname, 'JP-frontend');

// Run backend and frontend commands
async function start() {
  try {
    console.log('Starting JP-backend...');
    await runCommand('npm start', backendDir);

    console.log('Starting JP-frontend...');
    await runCommand('npm run dev', frontendDir);
  } catch (error) {
    console.error('Error running commands:', error);
  }
}

start();
