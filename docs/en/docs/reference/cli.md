## Description

Hapify is a code generation tool based on relational data models.
It uses a dedicated templating language.
It displays a web console for managing models and writing templates.

## Usage

### Installation

You must install this package globally to get the `hpf` command:

```bash
npm install -g @hapify/cli
```

To check the installed version, run `hpf --version`.

### Global options

- `-V`, `--version` : display the version number
- `--debug`: enable debug mode (default: `false`)
- `--silent`: enable silent mode (default: `false`)
- `-d <path>`, `--dir <path>`: changes the working directory. This path can be absolute or relative to the current path.
- `-k <secret>`, `--key <secret>`: forces the use of an API key rather than one defined in the global configuration. If you want to set your API key permanently, you should use the `hpf key` command.
- `-h`, `--help` : display the help

### Commands

#### <a name="config"></a>Define the global configuration

```bash
hpf config [options]
```

This command saves one or more global configurations in `~/.hapify/config.json`.
If the file does not exist, it will be automatically created.

_Available configuration_

- `hpf config --apiKey <secret>`: sets the API key to use for each command. This is equivalent to `hpf key <key>`.
- `hpf config --apiUrl <url>`: overrides the default API URL.

#### <a name="key"></a>Define the global API key

```bash
hpf key <key>
```

This command is an alias for `hpf config --apiKey <secret>`.

####  <a name="list"></a>List the boilerplates (channels)

```bash
hpf list
```

Alias: `hpf ls`

This command displays what is visible to the CLI from the current directory.
It displays the list of [channels](../getting-started/concepts/terminology.md) and the list of data models used by those channels.

The CLI searches for `hapify.json` files to automatically detect channels.
It iterates on the subdirectories. The default depth is `2`.
To change this value, use the `depth` option.

```bash
hpf list --depth 3
```

!!! warning "Warning"
    You are not supposed to run the CLI with different sets of data models.
    If you do, the first set found will be used.

#### <a name="generate"></a>Generate the code

```bash
hpf generate
```

Alias: `hpf g`

This command generates all the channels found from their templates and data models.
To set the depth for searching channels, use this option: `--depth <n>`. The default value is `2`.

```bash
hpf generate --depth 3
```

!!! tip "Tip"
    Empty generated files will not be saved.

#### <a name="export"></a>Export the code

```bash
hpf export
```

Alias: `hpf x`

This command generates a channel from its templates and data models and saves the generated files in a zip file.
You need to run this command from the channel directory, next to the `hapify.json` file.

By default, the zip file is named from the channel folder.
Example: `angular-admin/angular-admin.zip`.
You can define a custom path with this option: `-o, --output <path>`.

```bash
hpf export -o /path/to/file.zip
```

!!! tip "Tip"
    Empty generated files will not be saved.

#### <a name="import"></a>Import data models

```bash
hpf import
```

Alias: `hpf m`

Use this command to import predefined data models from Hapify Cloud (called [presets](../getting-started/concepts/terminology.md)).

_Import presets from ID_

You can also import presets from their IDs (visible on [Hapify Hub](https://hub.hapify.io/))

```bash
hpf import --preset ab123 --preset bd456
```

#### <a name="new"></a>Clone a boilerplate and start a new project

```bash
hpf new
```

Alias: `hpf n`

This command allows you to clone and configure a boilerplate.
It will ask you to :

- select a boilerplate
- select or create the project to use
- select [presets](../getting-started/concepts/terminology.md) of data models to import

_Options_

- `-p <id>`, `--project <id>`: The project to use (if it already exists)
- `-b <slug>`, `--boilerplate <slug>`: The slug of the boilerplate to clone
- `--boilerplate-id <id>`: The ID of the boilerplate to clone
- `--boilerplate-url [url]`: The git URLs of the boilerplates to clone
- `--preset [id]`: The ID of the presets to be preloaded into the project
- `--no-presets` : Do not request any presets
- `--project-name <name>` : The name of the project to create
- `--project-desc <description>`: The description of the project to create (the name must be defined)

To view the available presets, visit [hub.hapify.io](https://hub.hapify.io).

#### <a name="init"></a>Create a new boilerplate/channel

```bash
hpf init
```

Alias: `hpf i`

This command creates a new Hapify file structure in the current directory.
It creates 2 files `hapify.json`, `hapify-models.json` and a folder `.hapify` containing a template `models/__kebab__/hello.js.hpf`.
It will ask you to select or create a project.

_Options_

- `--channel-name <name>` : The name of the channel to initialize
- `--channel-desc <description>` : The description of the channel to initialize
- `--channel-logo <url>` : The URL of the logo of the channel to initialize
- `--project-name <name>` : The name of the project to create
- `--project-desc <description>`: The description of the project to create

#### <a name="use"></a>Define the project to use in a boilerplate/channel

```bash
hpf use
```

Alias: `hpf u`

Changes the project used by one or more existing [channels](../getting-started/concepts/terminology.md).
Changes the project ID in the `hapify.json` file for each channel found.
It will ask you to select or create the project to use.

_Options_

- `-p <id>`, `--project <id>`: The project to use (if already created)
- `--project-name <name>` : The name of the project to create
- `--project-desc <description>` : The description of the project to create

#### <a name="patch"></a>Patch generated code with new data models
                         
During the development process, you may add, change or delete some models.
To automatically merge the difference between two generations to your working branch, use this command.

This command uses `git format-patch` and `git am`.

```bash
hpf patch
```

It will let you choose the source branch and the commit, then the destination branch.

#### <a name="serve"></a>Start the console

Run this command to manage data models and templates.

```bash
hpf serve
```

This will start a web console for editing data models and templates.

_Options_

- `-p <n>`, `--port <n>`: The required port (default between `4800` and `4820`).
- `-H <hostname>`, `--hostname <hostname>`: The required hostname (default: `localhost`)
- `--no-open` : Do not open a new tab in the browser to display the console
- `--depth <n>` : The depth for searching channels (default: `2`)
