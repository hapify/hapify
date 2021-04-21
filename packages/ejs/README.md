# Hapify EJS

## Description

This repository provides a secured sandbox to render unsafe EJS templates

## Usage

### Basic usage

```typescript
import { HapifyEJS } from '@hapify/ejs';

const script = `hello <%= value %>`;
const result = new HapifyEJS().run(script, { value: 'world' }); // result = 'hello world'
```

### Advanced usage

```typescript
import { HapifyEJS } from '@hapify/ejs';

const script = `hello <%= value %>`;
const result = new HapifyEJS({
    timeout: 200, // Maximum script execution time. Default to 1000ms.
}).run(script, { value: 'world' }); // result = 'hello world'
```
