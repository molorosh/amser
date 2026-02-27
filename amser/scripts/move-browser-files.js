const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', '..', 'docs');
const browserDir = path.join(docsDir, 'browser');

// Check if browser directory exists
if (!fs.existsSync(browserDir)) {
  console.log('No browser folder to move. Skipping.');
  process.exit(0);
}

// Recursively copy files from browser/ to docs/ root
function moveFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      moveFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

try {
  console.log('Moving browser folder contents to docs root...');
  moveFiles(browserDir, docsDir);
  
  // Remove the now-empty browser folder
  fs.rmSync(browserDir, { recursive: true, force: true });
  
  console.log('✓ Successfully moved browser files to docs/');
} catch (err) {
  console.error('Error moving files:', err);
  process.exit(1);
}
