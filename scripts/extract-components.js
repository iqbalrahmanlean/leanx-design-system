const fs = require('fs');
const path = require('path');

const sourceDir = '../mam/src/components/ui';
const targetDir = './src/components';

// Component mapping for CSS class extraction
const componentMapping = {
  'button': {
    baseClass: 'btn',
    variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    sizes: ['sm', 'lg', 'icon']
  },
  'input': {
    baseClass: 'input',
    variants: ['default', 'error']
  },
  'card': {
    baseClass: 'card',
    variants: ['default', 'hover']
  },
  'badge': {
    baseClass: 'badge',
    variants: ['default', 'secondary', 'destructive', 'outline']
  },
  'alert': {
    baseClass: 'alert',
    variants: ['default', 'destructive']
  }
};

function extractTailwindClasses(content) {
  const classRegex = /className\s*=\s*{?["`']([^"`']*)["`']|}?/g;
  const cnRegex = /cn\s*\([^)]*["'`]([^"'`]*)["'`]/g;
  
  let matches;
  const classes = new Set();
  
  while ((matches = classRegex.exec(content)) !== null) {
    classes.add(matches[1]);
  }
  
  while ((matches = cnRegex.exec(content)) !== null) {
    classes.add(matches[1]);
  }
  
  return Array.from(classes);
}

function generateCSS(componentName, classes) {
  const config = componentMapping[componentName];
  if (!config) return '';
  
  let css = `/* ${componentName} component styles */\n`;
  
  // Base class
  css += `.${config.baseClass} {\n`;
  // Extract base classes from the component
  const baseClasses = classes.filter(cls => !cls.includes('hover:') && !cls.includes('focus:'));
  css += `  @apply ${baseClasses.join(' ')};\n`;
  css += '}\n\n';
  
  // Variants
  if (config.variants) {
    config.variants.forEach(variant => {
      css += `.${config.baseClass}-${variant} {\n`;
      css += `  /* Add variant-specific styles */\n`;
      css += '}\n\n';
    });
  }
  
  // Sizes
  if (config.sizes) {
    config.sizes.forEach(size => {
      css += `.${config.baseClass}-${size} {\n`;
      css += `  /* Add size-specific styles */\n`;
      css += '}\n\n';
    });
  }
  
  return css;
}

// Extract components
if (fs.existsSync(sourceDir)) {
  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      const componentName = file.replace('.tsx', '');
      const sourcePath = path.join(sourceDir, file);
      const content = fs.readFileSync(sourcePath, 'utf8');
      
      // Extract classes
      const classes = extractTailwindClasses(content);
      
      // Create component directory
      const componentDir = path.join(targetDir, componentName);
      if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir, { recursive: true });
      }
      
      // Generate CSS
      const css = generateCSS(componentName, classes);
      fs.writeFileSync(path.join(componentDir, `${componentName}.css`), css);
      
      // Create component export
      const exportContent = `export { default as ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} } from './${componentName}';`;
      fs.writeFileSync(path.join(componentDir, 'index.ts'), exportContent);
      
      console.log(`Extracted ${componentName} with classes:`, classes);
    }
  });
}
