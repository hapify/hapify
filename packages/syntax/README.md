# Hapify Syntax

## Description

This package parses templates written with the Hapify Syntax.

[![Build Status](https://api.travis-ci.com/hapify/syntax.svg?branch=master)](https://api.travis-ci.com/hapify/syntax) [![codecov](https://codecov.io/gh/hapify/syntax/branch/master/graph/badge.svg)](https://codecov.io/gh/hapify/syntax)

## Usage

```typescript
import { HapifySyntax } from '@hapify/syntax';

const template = "Model is <<Model camel>>.";
const model: { [key: string]: any; } = { /* Explicit model from generator */ };
HapifySyntax.run(template, model, { timeout: 2000 }); // Outputs 'Model is userProfile'.
```

## More

For more information about this module, please refer to the [online documentation](https://docs.hapify.io/en/latest/templating/hapify/syntax/).
