import commander from 'commander';
import { Container } from 'typedi';

import { ConfigCommand } from '../command/Config';
import { ExportCommand } from '../command/Export';
import { GenerateCommand } from '../command/Generate';
import { ImportCommand } from '../command/Import';
import { InitCommand } from '../command/Init';
import { KeyCommand } from '../command/Key';
import { ListCommand } from '../command/List';
import { NewCommand } from '../command/New';
import { PatchCommand } from '../command/Patch';
import { ServeCommand } from '../command/Serve';
import { UseCommand } from '../command/Use';
import { HttpServerService } from '../service/HttpServer';
import { OptionsService } from '../service/Options';

const packageJson = require('../../package.json');

function Aggregate(val: string, acc: string[]) {
  acc.push(val);
  return acc;
}

export class Program {
  private http: HttpServerService;

  private options: OptionsService;

  private program: commander.Command;

  constructor() {
    this.program = new commander.Command();
    this.http = Container.get(HttpServerService);
    this.options = Container.get(OptionsService);
    this.options.setProgram(this.program);
    this.init();
  }

  async run(argv: string[]): Promise<void> {
    await this.program.parseAsync(argv);
  }

  protected init(): void {
    this.program
      .version(packageJson.version)
      .description('Hapify Command Line Tool')
      .option('--debug', 'enable debug mode', false)
      .option('--silent', 'enable silent mode', false)
      .option('-d, --dir <path>', 'change the working directory')
      .option(
        '-k, --key <secret>',
        'override global API key for this command (If you want to define your API key permanently, you should use command "hpf key")',
      );

    this.program
      .command('config')
      .description('Define global configuration')
      .option('--apiKey <secret>', 'define the API key to use permanently')
      .option('--apiUrl <url>', 'override default API url')
      .action(ConfigCommand);

    this.program
      .command('key <key>')
      .description('Define the API key to use permanently')
      .action(KeyCommand);

    this.program
      .command('list')
      .alias('ls')
      .description('List available channels from the current directory')
      .option('--depth <n>', 'depth for channels discovery', '2')
      .action(ListCommand);

    this.program
      .command('generate')
      .alias('g')
      .description('Generate channel(s) from current directory')
      .option('--depth <n>', 'depth for channels discovery', '2')
      .action(GenerateCommand);

    this.program
      .command('export')
      .alias('x')
      .description('Export channel as ZIP from current directory')
      .option('-o, --output <path>', 'output file path')
      .action(ExportCommand);

    this.program
      .command('import')
      .alias('m')
      .description('Import pre-defined models from cloud')
      .option('--preset [id]', 'IDs of presets to preload', Aggregate, [])
      .action(ImportCommand);

    this.program
      .command('new')
      .alias('n')
      .option('-p, --project <id>', 'ID of the project to use')
      .option(
        '-b, --boilerplate <slug>',
        'slug-name of the boilerplate to clone',
      )
      .option('--boilerplate-id <id>', 'ID of the boilerplate to clone')
      .option(
        '--boilerplate-url [url]',
        'urls of the boilerplates to clone',
        Aggregate,
        [],
      )
      .option('--preset [id]', 'ID of presets to preload', Aggregate, [])
      .option('--no-presets', 'do not prompt for presets')
      .option('--project-name <name>', 'name of the project to create')
      .option(
        '--project-desc <description>',
        'description of the project to create (name must be defined)',
      )
      .description('Clone and init a boilerplate')
      .action(NewCommand);

    this.program
      .command('init')
      .alias('i')
      .option('--channel-name <name>', 'name of the channel to init')
      .option(
        '--channel-desc <description>',
        'description of the channel to init',
      )
      .option('--channel-logo <url>', 'url of the logo of the channel to init')
      .option('--project-name <name>', 'name of the project to create')
      .option(
        '--project-desc <description>',
        'description of the project to create (name must be defined)',
      )
      .description('Init a new Hapify channel in the directory')
      .action(InitCommand);

    this.program
      .command('use')
      .alias('u')
      .option('-p, --project <id>', 'ID of the project to use')
      .option('--project-name <name>', 'name of the project to create')
      .option(
        '--project-desc <description>',
        'description of the project to create (name must be defined)',
      )
      .description('Change the project used by existing channel(s)')
      .action(UseCommand);

    this.program
      .command('patch')
      .alias('p')
      .description(
        'Compute patch between two commits and apply it to another branch',
      )
      .action(PatchCommand);

    this.program
      .command('serve')
      .alias('s')
      .description('Start Hapify console for channel(s) and models edition')
      .option(
        '-p, --port <n>',
        `the required port number (default between ${this.http.minPort} and ${this.http.maxPort})`,
      )
      .option('-H, --hostname <hostname>', `the required hostname`, 'localhost')
      .option('--no-open', 'do not open a new tab in the browser')
      .option('--depth <n>', 'depth for channels discovery', '2')
      .action(ServeCommand);
  }
}
