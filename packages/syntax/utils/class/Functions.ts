import * as Fs from 'fs';
import * as Path from 'path';

export function GetFilesFromPath(path: string, extensions: string[]): { path: string; name: string }[] {
	const entries = Fs.readdirSync(path, { withFileTypes: true });

	// Get files within the current directory and add a path key to the file objects
	const files = entries
		.filter((file) => !file.isDirectory())
		.filter((file) => extensions.includes(Path.extname(file.name)))
		.map((file) => ({ ...file, path: Path.join(path, file.name) }));

	// Get folders within the current directory
	const folders = entries.filter((folder) => folder.isDirectory());

	for (const folder of folders) {
		/*
		  Add the found files within the subdirectory to the files array by calling the
		  current function itself
		*/
		files.push(...GetFilesFromPath(Path.join(path, folder.name), extensions));
	}

	return files;
}

export function Die(message: string): void {
	console.error(message);
	process.exit(1);
}
