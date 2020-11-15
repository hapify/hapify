# Hapify CLI

## Description

Hapify is a code generation tool based on relational data models.
It uses a dedicated templating language.
It exposes a web-based console for models definition and templates writing.

## Usage

### Installation

You need to install this package globally to have the `hpf` command:

```bash
npm install -g @hapify/cli
```

To check the installed version, run `hpf --version`.

### Global options

-   `-V`, `--version`: output the version number
-   `--debug`: enable debug mode
-   `-d <path>`, `--dir <path>`: change the working directory. This path can be absolute or relative to the current path
-   `-k <secret>`, `--key <secret>`: force usage of an API key rather than the one defined in global config. If you want to define your api key permanently, you should use command `hpf key`)
-   `-h`, `--help`: show help

### Commands

#### Set global configuration

```bash
hpf config [options]
```

This command stores your one (or more) global configuration in `~/.hapify/config.json`.
If the file does not exists, it will be automatically created.

_Available configuration_

-   `hpf config --apiKey <secret>`: define the API key to use for every commands. This is equivalent to `hpf key <key>`.
-   `hpf config --apiUrl <url>`: override default api url.

#### Set global API key

```bash
hpf key <key>
```

This command is an alias of `hpf config --apiKey <secret>`.

#### List visible boilerplates (channels)

```bash
hpf list
```

Alias: `hpf ls`

This command displays what is visible for the CLI from this directory.
It shows the list of channels and the list of models used by those channels.

The CLI looks for `hapify.json` files to auto-detect channels.
It recurses over sub-directories. Default depth is `2`.
To modify this value, use the `depth` option.

```bash
hpf list --depth 3
```

_Note:_
You are not supposed to run the CLI with different models sets.
If this is the case, the first found set will be used.

#### Generate the code

```bash
hpf generate
```

Alias: `hpf g`

This command generates all found channels from theirs templates and models.
To define the depth to look for channels, use this option: `--depth <n>`. Default is `2`.

```bash
hpf generate --depth 3
```

#### Export the code

```bash
hpf export
```

Alias: `hpf x`

This command generates the channel from its templates and its models.
Then it saves the generated files in a zip file.
To run this command you must be in the channel directory, next to the `hapify.json` file.

By default, the zip file has the channel's name, ie the folder name.
Example: `angular-admin/angular-admin.zip`.
You can define a custom path with this option: `-o, --output <path>`.

```bash
hpf export -o /path/to/file.zip
```

#### Import the models

```bash
hpf import
```

Alias: `hpf m`

Use this command to import pre-defined models from the Cloud database (called presets).
This command displays the list of available presets of models.
Press space bar to select a preset to import and enter to confirm.

_Import presets from ids_

Alternatively, you can import presets from their Ids (visible in [Hapify Hub](https://hub.hapify.io/))

```bash
hpf import --preset ab123 --preset bd456
```

#### Clone a boilerplate and start a new project

```bash
hpf new
```

Alias: `hpf n`

This command let you clone and configure a boilerplate.
It will prompt a form to:

-   select a boilerpalte
-   select or create the project to use
-   select models to import

_Options_

-   `-p <id>`, `--project <id>`: The project to use (if already existing)
-   `-b <slug>`, `--boilerplate <slug>`: The slug name of the boilerplate to clone
-   `--boilerplate-id <id>`: The id of the boilerplate to clone
-   `--boilerplate-url <url>`: The git URL of the boilerplate to clone
-   `--preset [id]`: Ids of presets to preload in the project
-   `--no-presets`: Do not prompt for presets
-   `--project-name <name>`: The project's name to create
-   `--project-desc <description>`: The project's description to create (name must be defined)

To browse available boilerplates, please visit [hub.hapify.io](https://hub.hapify.io).

#### Create a new boilerplate (channel)

```bash
hpf init
```

Alias: `hpf i`

This command creates a new Hapify files structure in the current directory.
It creates a file `hapify.json` and a folder `hapify` containing a template `models/model/hello.js.hpf`.
It will prompt a form to select or create a project.

_Options_

-   `-p <id>`, `--project <id>`: The project to use (if already created)
-   `--channel-name <name>`: The name of the channel to init
-   `--channel-desc <description>`: The description of the channel to init
-   `--channel-logo <url>`: The URL of the logo of the channel to init
-   `--project-name <name>`: The project's name to create
-   `--project-desc <description>`: The project's description to create (name must be defined)

#### Define project to use in a boilerplate (channel)

```bash
hpf use
```

Alias: `hpf u`

Change the project used by one or more existing channels.
It changes the project's id in file `hapify.json` for each found channels.
It will prompt a form to select or create the project to use.

_Options_

-   `-p <id>`, `--project <id>`: The project to use (if already created)
-   `--project-name <name>`: The project's name to create
-   `--project-desc <description>`: The project's description to create

#### Patch source code with new models

During the development process, you may want to add, edit or remove some models.
To automatically apply the difference between two generation to your working branch, use this command.

This command uses `git format-patch` and `git am`.

```bash
hpf patch
```

This will prompt a form to let you choose the source branch and commits then destination branch.

#### Start the console

Run this command to edit models and templates.

```bash
hpf serve
```

This will start a server that hosts a web-based console for models and templates edition.

_Options_

-   `-p <n>`, `--port <n>`: the required port number (default between 4800 and 4820)
-   `-H <hostname>`, `--hostname <hostname>`: the required hostname (default: localhost)
-   `--no-open`: do not open a new tab in the browser to show the console
-   `--depth <n>`: depth to recursively look for channels (default: 2)
