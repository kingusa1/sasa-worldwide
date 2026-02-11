/**
 * Fix auth imports across the codebase
 * Run with: npx tsx scripts/fix-auth-imports.ts
 */

import * as fs from 'fs';
import * as path from 'path';

function replaceInFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updated = content.replace(/@\/lib\/auth\/config/g, '@/auth');

    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf-8');
      console.log('✅ Updated:', filePath);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('❌ Error updating', filePath, error.message);
    return false;
  }
}

function walkDir(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next') {
        results = results.concat(walkDir(filePath));
      }
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });

  return results;
}

console.log('🔄 Fixing auth imports...\n');

const appFiles = walkDir('app');
let updatedCount = 0;

appFiles.forEach(file => {
  if (replaceInFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✅ Updated ${updatedCount} files`);
