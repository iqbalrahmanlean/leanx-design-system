# 🎨 LeanX Design System

A cross-framework design system built from Next.js + shadcn/ui components, designed to work seamlessly with Vue.js, React, and any web framework.

[![npm version](https://badge.fury.io/js/%40iqbalrahman%2Fdesign-system.svg)](https://www.npmjs.com/package/@iqbalrahman/design-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Installation

npm install @iqbalrahman/design-system

### Usage

#### Vue.js

<template>
 <div>
   <button class="btn btn-default">Click me</button>
   <input class="input" placeholder="Enter text" />
   
   <div class="card">
     <div class="card-header">
       <h3 class="card-title">Hello World</h3>
       <p class="card-description">This is a card</p>
     </div>
     <div class="card-content">
       <span class="badge badge-default">Vue.js</span>
     </div>
   </div>
 </div>
</template>

<style>
@import "@iqbalrahman/design-system/dist/styles.css";
</style>

#### React

import '@iqbalrahman/design-system/dist/styles.css';

function App() {
 return (
   <div>
     <button className="btn btn-default">Click me</button>
     <input className="input" placeholder="Enter text" />
     
     <div className="card">
       <div className="card-header">
         <h3 className="card-title">Hello World</h3>
         <p className="card-description">This is a card</p>
       </div>
       <div className="card-content">
         <span className="badge badge-default">React</span>
       </div>
     </div>
   </div>
 );
}

## 🎯 Available Components

### Buttons
- .btn - Base button class
- .btn-default - Primary button
- .btn-secondary - Secondary button  
- .btn-outline - Outline button
- .btn-destructive - Destructive button
- .btn-sm, .btn-lg - Size variants

### Inputs
- .input - Base input class

### Cards
- .card - Card container
- .card-header - Card header
- .card-title - Card title
- .card-description - Card description
- .card-content - Card content
- .card-footer - Card footer

### Badges
- .badge - Base badge class
- .badge-default - Default badge
- .badge-secondary - Secondary badge
- .badge-destructive - Destructive badge
- .badge-outline - Outline badge

## 🎨 Theming

Customize the design system using CSS variables:

:root {
 --primary: 220 100% 50%;
 --radius: 1rem;
 --font-sans: 'Inter', sans-serif;
}

## 📝 License

MIT © [Iqbal Rahman](https://github.com/iqbalrahmanlean)
