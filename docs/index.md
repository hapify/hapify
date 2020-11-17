# Get Started with Hapify

Hapify was born out of the desire to accelerate modern development, by replacing traditionnal statics boilerplates with dynamic boilerplates.

Hapify removes the need to write repeating boilerplate for extended CRUD operations for both backend & frontend development.
Focus on features instead of doing repetitive work !

* Hapify is an agnostic code generator allowing the creation of any kind of app.
* Hapify takes two inputs, the relational data-models and code templates.
* Hapify by does not command any paradigm or code structure. Users can defined their own code templates with their preferred language.

To be more efficient, the generated code is meant to be used within a boilerplate.
Therefore, boilerplates for Hapify embed compatible code templates. You can browse code boilerplate [here](https://hub.hapify.io).

### Tutorial quick overview

![Hapify CLI - Terminal sample](assets/get-started.gif 'Terminal sample')

## 1. Install the CLI

First step, install the CLI using NPM:

```bash
npm install -g @hapify/cli
```

Additionally you can check if the package is installed by running: `hpf --version`.

## 2. Start a new project

In this section, we will describe how to start a project from an existing boilerplate.
To start a project from a legacy boilerplate, please refer to [legacy](templating/code-samples/).

### Prepare folder

Create an new folder for your project and go to this one:

```bash
mkdir my-project && cd my-project
```

Use `new` command to get a boilerplate and initialize your project

```bash
hpf new
```

### Choose/create the project

First, you need to choose or create a new project. This will prompt something like this:

```
$ hpf new
? Choose a project
❯ Create a new project
  ──────────────
  Project 1
  Project 2
```

Select _Create a new project_ then enter a name and a description, or select and existing project.

### Choose one or more boilerplates

Once you have selected a project, you will be able to choose a public boilerplate (available in the Hapify Hub), or to enter custom git URL.

```
? Choose a boilerplate
  Enter a Git URL
  ──────────────
❯ HapiJS
  ExpressJS
  Angular 7
  Vue.js
```

After this, you can add another boilerplate:

```
? Choose a project New one
? Choose a boilerplate HapiJS
? Add another boilerplate? (y/N)
```

For example, if you chose a back-end boilerplate, you can add one or more front-end boilerplate.
If you need only one boilerplate or if you chose a full-stack boilerplate, just say `No`.

### Import pre-defined models

If your project is empty, you may want to import pre-defined models from Hapify Cloud.
To do so, select some use cases when this prompt:

```
? Choose some presets to preload in your project
 ◉ Membership
 ◯ Messaging
 ◯ Billing
❯◉ Listing
```

Press the space bar to select and then enter to validate.

### Processing

After few seconds, the boilerplate will be cloned in your current folder and you will see:

```
✓ Created 1 new dynamic boilerplate in ~/my-project. Run 'hpf serve' to edit.
```

## 3. Edit project models

At this stage you you have a fresh boilerplate but no data-models in your project, unless you have imported pre-defined models.
In order to create or edit the models of your project, run this command to start the local GUI:

```bash
hpf serve
```

The local GUI looks like:

![Hapify GUI - models edition](assets/gui-models.png 'Models Edition')

To learn more about models management please refer to [GUI Models](concepts/models/).

## 4. Generate the code

Once your models are ready, you will be able to generate the code with this command:

```bash
hpf generate
```

This will run the generator and copy the generated files into your local boilerplate.
Now you can start customizing and running the generated code.

## 5. Lifecycle

Use the command `hpf patch` if you need to re-generate the code due to models or templates modifications, whereas you have already modified the generated code.
To prevent conflict during re-generation, please read our [best practices guide](best-practices).

## Store your models in Hapify Cloud

By default, Hapify stores your models locally. Usually next to the `hapify.json` file. The path is defined in this file.

If you prefer to store your models remotely, follow the next steps

### 1. Connect the CLI to Hapify Cloud

The Hapify CLI interact with Hapify Cloud for project & models storage and code generation.
Therefore, you need to get an API key from Hapify Cloud to access all the CLI features.

### 2. Register on Hapify Cloud

If you do not have an account yet, please visit [hapify.io/sign-up](https://www.hapify.io/sign-up).

#### Get API key

Once you have registered, or if you already have an account, go to [hapify.io/my-key](https://www.hapify.io/my-key) and copy your API Key.

#### Configure the CLI

Run [this command](cli/#set-global-api-key) with your API key to connect the CLI to Hapify Cloud once for all.

```bash
hpf key XXXXXXXXXXXX
```

Now your CLI can interact with Hapify Cloud.

### 3. Connect your local boilerplate to a remote project

For every boilerplate you want to connect a remote project run [this command](cli/#define-project-to-use-in-a-boilerplate-channel):

```bash
hpf use
```

Then create or select a project.

Now the boilerplate will store and read models from Hapify Cloud.
The id of the project is stored in `hapify.json`.
