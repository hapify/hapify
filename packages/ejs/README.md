# Hapify EJS

## Description

This repository provides a secured sandbox to render unsafe EJS templates

[![Build Status](https://api.travis-ci.com/hapify/ejs.svg?branch=master)](https://api.travis-ci.com/hapify/ejs) [![codecov](https://codecov.io/gh/hapify/ejs/branch/master/graph/badge.svg)](https://codecov.io/gh/hapify/ejs)

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
