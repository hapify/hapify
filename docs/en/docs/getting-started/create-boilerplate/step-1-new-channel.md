!!! question "Channel vs boilerplate ?"
    A channel is a set of templates. Most boilerplates have only one channel.
    However, a full-stack boilerplate can contain two channels, one for front-end templates and one for back-end templates.

## Run the command `init`.

Create a new folder for your project and go to that folder:

```bash
mkdir my-project && cd my-project
```

!!! tip "Tip"
    You can also start a channel in a pre-existing boilerplate.

Use [the command](../../reference/cli.md#init) `init` to initialize a channel in this folder. 

```bash
hpf init
```

#### Create a project

You must create a new project in order to create a new channel.
When prompted, enter the name and description.

```
? Enter a project name First project
? Enter a project description My first project with Hapify
```

#### Create the channel

Once the project is defined, enter the channel details.

```
? Enter the channel name Typescript Backend
? Enter a description API for my app
? Enter a logo URL https://cdn.worldvectorlogo.com/logos/typescript.svg
✓ Initialized a channel in /Users/edouard/workspace/hapify/my-project.
Run hpf use to connect a remote project (optional)
```

Here is the hierarchy of the created files:
    
```
~/my-project
├── .hapify
|  ├── models
|  |  └── __kebab__
|  |     └── hello.js.hpf
|  └── validator.js
├── hapify-models.json
└── hapify.json
```

`hapify.json` is the configuration file. It contains the channel metadata and the list of templates.

The `hapify-models.json` file contains the data models for your project.
It is referenced by the configuration file (`hapify.json`).
You can move or rename this file as long as you change the path in the configuration file.

The `.hapify` folder (can also be named `hapify`) contains all the channel templates. 
