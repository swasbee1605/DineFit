#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function removeComments(code) {
  // Remove single line comments
  code = code.replace(/^\s*\/\/.*$/gm, '');
  
  // Remove JSX comments {/* */}
  code = code.replace(/{\s*\/\*[\s\S]*?\*\/\s*}/g, '');
  
  // Remove block comments /* */
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove empty lines that were left behind
  code = code.replace(/^\s*\n/gm, '');
  
  return code;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = removeComments(content);
    fs.writeFileSync(filePath, cleanedContent);
    console.log(`✅ Cleaned: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function findJSFiles(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const jsFiles = findJSFiles(srcDir);

console.log(`Found ${jsFiles.length} JavaScript/JSX files`);
console.log('Removing comments...\n');

jsFiles.forEach(processFile);

console.log(`\n🎉 Successfully removed comments from ${jsFiles.length} files!`);
