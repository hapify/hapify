// This tools convert all *.hpf files from short syntax to long syntax. This operation is idempotent
// Usage: npm run convert-to-long -- /path/to/dir/to/convert

import * as Fs from 'fs';
import * as Path from 'path';
import { Die, GetFilesFromPath } from './class/Functions';
import { ShortToLongConverter } from './class/ShortToLongConverter';

if (process.argv.length < 3) {
	Die(`You must define a path to process`);
}
const pathArg = process.argv.pop();
const rootPath = Path.isAbsolute(pathArg) ? pathArg : Path.resolve(process.cwd(), pathArg);

if (!Fs.existsSync(rootPath)) {
	Die(`${rootPath} does not exists`);
}
if (!Fs.lstatSync(rootPath).isDirectory()) {
	Die(`${rootPath} is not a directory`);
}

const files = GetFilesFromPath(rootPath, ['.hpf']);
for (const file of files) {
	const template = Fs.readFileSync(file.path, { encoding: 'utf8' });
	const converter = new ShortToLongConverter(template);
	const newTemplate = converter.execute();
	// console.log(newTemplate);
	Fs.writeFileSync(file.path, newTemplate, { encoding: 'utf8' });
}

console.log(`Converted ${files.length} file(s) to long syntax`);
