# Hapify VM

## Description

This repository provides a secured sandbox to execute unsafe JavaScript code

[![Build Status](https://api.travis-ci.com/hapify/vm.svg?branch=master)](https://api.travis-ci.com/hapify/vm) [![codecov](https://codecov.io/gh/hapify/vm/branch/master/graph/badge.svg)](https://codecov.io/gh/hapify/vm)

## Usage

### Basic usage

```typescript
import { HapifyVM } from '@hapify/vm';

const script = `const concat = a + b; return concat;`;
const result = new HapifyVM().run(script, { a: 'hello', b: 'world' }); // result = 'hello world'
```

### Advanced usage

```typescript
import { HapifyVM } from '@hapify/vm';

const script = `const sum = a + b; return sum;`;
const options = {
    timeout: 200, // Maximum script execution time. Default to 1000ms.
    allowAnyOutput: true, // Allow the input script to return any data type. Default to false.
    eval: true // Allow function constructors (Function, GeneratorFunction, etc)
};
const result = new HapifyVM(options).run(script, { a: 1, b: 2 }); // result = 3
```
