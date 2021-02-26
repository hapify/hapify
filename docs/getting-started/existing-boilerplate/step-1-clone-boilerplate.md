## Run the `new` command

Create a new folder for your project and go to this folder:

```bash
mkdir my-project && cd my-project
```

Use `new` command to clone a boilerplate and initialize your project:

```bash
hpf new
```

## Choose one or more boilerplates

Once you have selected a project, you will be able to choose a public boilerplate (available in the Hapify Hub), or to enter a custom git URL.

```
? Choose a boilerplate 
  Enter a Git URL 
  ──────────────
❯ HapiJS Backend 
  NG-ZORRO Components 
  NG-ZORRO Dashboard 
  PHP Slim Backend 
```

Next, you can add another boilerplate:

```
? Choose a project New one
? Choose a boilerplate HapiJS
? Add another boilerplate? (y/N)
```

For example, if you choose a back-end boilerplate, you can add one or more front-end boilerplates.
If you need only one boilerplate or if you choose a full-stack boilerplate, just say `No`.

### Use a boilerplate from a git repository

If you want to use a boilerplate that is not listed, choose option `Enter a Git URL` and type or paste the URL:

```
? Choose a boilerplate Enter a Git URL
? Enter boilerplate Git URL https://github.com/someone/somerepo.git
```

You must enter an URL compatible with `git clone`.

## Import pre-defined models

You may want to import pre-defined models from Hapify Cloud.
To do so, select some use cases when this prompts:

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

After a few seconds, the boilerplate will be cloned in your current folder and you will see:

```
✓ Created 2 new dynamic boilerplates in ~/my-project.
Run hpf use to connect a remote project (optional).
Run hpf serve to edit models and templates.
Run hpf generate to generate the source code.
```

The folder structure looks like this:

```
my-project
│
│───boilerplate-hapijs
│   │   hapify.json
│   │   hapify-models.json
│   │   Dockerfile
│   │   package.json
│   │   ...
│   │   
│   └───.hapify
│       │   validator.js
│       │   ...
│ 
└───boilerplate-ngx-dashboard
    │   hapify.json
    │   angular.json
    │   package.json
    │   ...
    │   
    └───.hapify
        │   ...
```

`hapify.json` is the config file. It contains the boilerplate's meta-data and the templates list.

`hapify-models.json` is the models file. It contains the models of your project.
It is referenced by the config files (`hapify.json`).
You can move or rename this models file as long as you change the path in the config files.

`.hapify` folder (can also be nammed `hapify`) is the templates folder. It contains all the templates of the boilerplate.

## **Optional**: Store your models on Hapify Cloud

By default, Hapify stores your models locally. The path is defined in the config file.
You can store your models remotely, in order to share them across multiple repositories.

To connect the CLI to Hapify Cloud, please follow [these steps](../../installation/#optional-connect-the-cli-to-hapify-cloud)

### Connect your local boilerplate to a remote project

Run [this command](../../reference/cli/#define-project-to-use-in-a-boilerplate-channel) to configure your local boilerplate:

```bash
hpf use
```

#### Create a project

You can create a project directly from the CLI by selecting `Create a new project`.
When prompt, enter name and description.

```
? Choose a project Create a new project
? Enter a project name First project
? Enter a project description My first project with Hapify
```

#### Select an existing project

From the list below, select a project from you account.

```
? Choose a project (Use arrow keys)
  Create a new project 
  ──────────────
❯ First project
  Second project
```

!!! tip inline end
    You can create a project online from you Hapify account: [https://www.hapify.io/my-projects](https://www.hapify.io/my-projects)

Now the boilerplate will store and read models from Hapify Cloud.

```
? Choose a project First project
✓ Did set project 5c893c0a74e4650010e6f683 for channel HapiJS
✓ Did set project 5c893c0a74e4650010e6f683 for channel Angular Dashboard
```

The ID of the project is stored in config files (`hapify.json`).
