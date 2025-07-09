import fs from 'fs';
import path from 'path';

// Read all CSS files and combine them
const baseCSS = fs.readFileSync('src/styles/base.css', 'utf8');
const buttonCSS = fs.readFileSync('src/components/button/button.css', 'utf8');
const inputCSS = fs.readFileSync('src/components/input/input.css', 'utf8');
const cardCSS = fs.readFileSync('src/components/card/card.css', 'utf8');
const badgeCSS = fs.readFileSync('src/components/badge/badge.css', 'utf8');
const alertCSS = fs.readFileSync('src/components/alert/alert.css', 'utf8');
const checkboxCSS = fs.readFileSync('src/components/checkbox/checkbox.css', 'utf8');
const textareaCSS = fs.readFileSync('src/components/textarea/textarea.css', 'utf8');
const switchCSS = fs.readFileSync('src/components/switch/switch.css', 'utf8');
const separatorCSS = fs.readFileSync('src/components/separator/separator.css', 'utf8');

// Combine all CSS
const combinedCSS = [
  '/* LeanX Design System v1.1.0 */',
  '/* https://github.com/iqbalrahmanlean/leanx-design-system */',
  '',
  '/* Base Styles */',
  baseCSS,
  '',
  '/* Button Component */',
  buttonCSS,
  '',
  '/* Input Component */',
  inputCSS,
  '',
  '/* Card Component */',
  cardCSS,
  '',
  '/* Badge Component */',
  badgeCSS,
  '',
  '/* Alert Component */',
  alertCSS,
  '',
  '/* Checkbox Component */',
  checkboxCSS,
  '',
  '/* Textarea Component */',
  textareaCSS,
  '',
  '/* Switch Component */',
  switchCSS,
  '',
  '/* Separator Component */',
  separatorCSS
].join('\n');

// Make sure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Write the combined CSS
fs.writeFileSync('dist/styles.css', combinedCSS);
console.log('✅ Built styles.css with all components');
