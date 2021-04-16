if (typeof process !== 'undefined') {
    throw new Error('process is defined');
}
if (typeof module !== 'undefined') {
    throw new Error('module is defined');
}
if (typeof exports !== 'undefined') {
    throw new Error('exports is defined');
}

if (typeof __dirname !== 'undefined') {
    throw new Error('__dirname is defined');
}
if (typeof __filename !== 'undefined') {
    throw new Error('__filename is defined');
}

if (typeof require !== 'undefined') {
    throw new Error('require is defined');
}
