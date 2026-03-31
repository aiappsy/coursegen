import fs from 'fs';
import path from 'path';

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else {
      results.push(file);
    }
  });
  return results;
};

const cleanFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('<<<<<<< HEAD')) {
      console.log(`Cleaning ${filePath}...`);
      // Regex to keep content between <<<<<<< HEAD and =======, and discard between ======= and >>>>>>>
      const cleanedContent = content.replace(/<<<<<<< HEAD([\s\S]*?)=======([\s\S]*?)>>>>>>> [a-f0-9]+/g, '$1');
      fs.writeFileSync(filePath, cleanedContent, 'utf8');
      return true;
    }
  } catch (err) {
    // Skip binary files
  }
  return false;
};

const files = walk('.');
let cleanedCount = 0;
files.forEach((file) => {
  if (cleanFile(file)) {
    cleanedCount++;
  }
});

console.log(`Finished! Cleaned ${cleanedCount} files.`);
