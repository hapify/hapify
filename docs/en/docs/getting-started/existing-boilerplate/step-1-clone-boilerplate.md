## Run the `new` command

Create a new folder for your project and go to that folder:

```bash
mkdir my-project && cd my-project
```

Use the `new` [command](../../reference/cli.md#new) to clone a boilerplate and initialize your project:

```bash
hpf new
```

## Choose one or more boilerplates

Once you have selected a project, you can choose a public boilerplate (available on the [Hapify Hub](https://hub.hapify.io/)) or enter a custom git URL.

```
? Choose a boilerplate 
  Enter a Git URL 
  ──────────────
❯ HapiJS Backend 
  NG-ZORRO Components 
  NG-ZORRO Dashboard 
  PHP Slim Backend 
```

You can add another boilerplate:

```
? Choose a project New one
? Choose a boilerplate HapiJS
? Add another boilerplate? (y/N)
```

For example, if you choose a back-end boilerplate, you can add one or more front-end boilerplates.
If you only need one boilerplate or if you choose a full-stack boilerplate, just select `No`.

### Using a boilerplate from a git repository

If you want to use a boilerplate that is not listed, choose the `Enter a Git URL` option and then type or paste the URL :

```
? Choose a boilerplate Enter a Git URL
? Enter boilerplate Git URL https://github.com/someone/somerepo.git
```

You must enter a URL compatible with `git clone`.

## Importing predefined data models

You can import collections of predefined data models ([presets](../concepts/terminology.md)) from Hapify Cloud.
To do so, select one or more presets when prompted:

```
? Choose some presets to preload in your project 
 ◉ User
 ◯ Listing
 ◯ Messaging
❯◉ Food delivery
 ◯ Shopping cart & wishlist
```

## Enter name and description

```
? Enter a project name Food delivery
? Enter a project description A food delivery app
```

## Output

After a few seconds, the boilerplate will be cloned into your current folder:

```
✓ Created 2 new dynamic boilerplates in ~/my-project.
Run hpf use to connect a remote project (optional).
Run hpf serve to edit models and templates.
Run hpf generate to generate the source code.
```

The folder structure looks like this:

```
~/my-project
├── boilerplate-hapijs
|  ├── .hapify
|  |  ├── routes
|  |  └── validator.js
|  ├── Dockerfile
|  ├── hapify-models.json
|  ├── hapify.json
|  └── ...
└── boilerplate-ngx-dashboard
   ├── .hapify
   |  ├── src
   |  └── validator.js
   ├── src
   |  ├── app
   |  ├── assets
   |  ├── index.html
   |  └── ...
   ├── hapify.json
   └── ...
```

`hapify.json` is the configuration file. It contains the boilerplate metadata and the list of templates.

The `hapify-models.json` file contains the data models for your project.
It is referenced by the configuration file (`hapify.json`).
You can move or rename this file as long as you change the path in the configuration file.

The `.hapify` folder (can also be named `hapify`) is the templates folder. It contains all the templates for the boilerplate.

## **Optional**: Store your data models on Hapify Cloud

By default, Hapify stores your data models locally. The path is defined in the configuration file.
You can store your data models online, so you can share them across multiple repositories.

To connect the CLI to Hapify Cloud, please follow [these steps](../installation.md#cloud).

### Connect your boilerplate to a remote project

Run [this command](../../reference/cli.md#use) to configure your boilerplate:

```bash
hpf use
```

#### Create a project

You can create a project directly from the CLI by selecting `Create a new project`.
Enter the name and description when prompted.

```
? Choose a project Create a new project
? Enter a project name First project
? Enter a project description My first project with Hapify
```

#### Select an existing project

From the list below, select a project from your account.

```
? Choose a project (Use arrow keys)
  Create a new project 
  ──────────────
❯ First project
  Second project
```

!!! tip "Tip"
    You can create a project online from your Hapify account: [https://www.hapify.io/my-projects](https://www.hapify.io/my-projects)

The boilerplate will now store and read the models from Hapify Cloud.

```
? Choose a project First project
✓ Did set project 5c893c0a74e4650010e6f683 for channel HapiJS
✓ Did set project 5c893c0a74e4650010e6f683 for channel Angular Dashboard
```

The project ID is stored in the configuration file (`hapify.json`).
