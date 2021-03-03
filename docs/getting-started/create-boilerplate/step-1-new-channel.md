!!! abstract "Channel vs. boilerplate ?"
    A channel is a group of templates. Most boilerplates only have one channel.
    However, a full-stack boilerplate may contain two channels, for the front-end and the back-end templates.

## Run the `init` command

Create a new folder for your project and go to this folder:

```bash
mkdir my-project && cd my-project
```

!!! tip
    You can also start a channel within an existing boilerplate.


Use `init` command to initialize a channel in this folder.

```bash
hpf init
```

#### Create a project

You must create a new project in order to create a new channel.
When prompt, enter name and description.

```bash
? Enter a project name First project
? Enter a project description My first project with Hapify
```

#### Create the channel

Once the project is defined, enter the channel's details.

```bash
? Enter the channel name Typescript Backend
? Enter a description API for my app
? Enter a logo URL https://cdn.worldvectorlogo.com/logos/typescript.svg
✓ Initialized a channel in /Users/edouard/workspace/hapify/my-project.
Run hpf use to connect a remote project (optional)
```

Here is the created files hierarchy:
    
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

`hapify.json` is the config file. It contains the boilerplate's meta-data and the templates list.

`hapify-models.json` is the models file. It contains the models of your project.
It is referenced by the config files (`hapify.json`).
You can move or rename this models file as long as you change the path in the config files.

`.hapify` folder (can also be named `hapify`) is the templates folder. It contains all the templates of the boilerplate.
