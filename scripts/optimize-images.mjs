import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imgDir = 'public/images';

async function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDir(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      const outPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      if (!fs.existsSync(outPath)) {
        try {
          await sharp(fullPath).webp({ quality: 80 }).toFile(outPath);
          console.log('OK:', outPath);
        } catch (e) {
          console.log('ERR:', fullPath, '-', e.message);
        }
      }
    }
  }
}

await processDir(imgDir);
console.log('Done!');
