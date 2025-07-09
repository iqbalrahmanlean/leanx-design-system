import fs from 'fs';
import path from 'path';

const baseCSS = fs.readFileSync('src/styles/base.css', 'utf8');
const buttonCSS = fs.readFileSync('src/components/button/button.css', 'utf8');
const inputCSS = fs.readFileSync('src/components/input/input.css', 'utf8');
const cardCSS = fs.readFileSync('src/components/card/card.css', 'utf8');
const badgeCSS = fs.readFileSync('src/components/badge/badge.css', 'utf8');

const combinedCSS = [
  '/* LeanX Design System v1.0.2 */',
  '/* https://github.com/iqbalrahmanlean/leanx-design-system */',
  '',
  baseCSS,
  '',
  buttonCSS,
  '',
  inputCSS,
  '',
  cardCSS,
  '',
  badgeCSS
].join('\n');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

fs.writeFileSync('dist/styles.css', combinedCSS);
console.log('✅ Built styles.css');
