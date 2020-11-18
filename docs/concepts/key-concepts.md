# Key concepts

Hapify removes the need to write repeating boilerplates for extended CRUD operations for both back-end & front-end development. Focus on features instead of doing repetitive work!

- Hapify is an agnostic code engine & tool allowing the creation of any kind of API based app, in any language

- Hapify does not command any paradigm or code structure. You can write your own code templates or use the ones provided by the community.

- Hapify takes two inputs; **relational data-models** and **meta-templates**.

## Templating

Hapify provides a simple but powerful syntax to help you create dynamic boilerplates.
Using Hapify you can either:

- **Reverse Engineer** your own static boilerplates
- Use **[community boilerplates](https://hub.hapify.io/)**

For detailed information about templating you can refer to the [syntax documentation](../templating/hapify) and the [templating documentation](../templating/javascript).

## Modeling 

Hapify lets you define the data-models that fit your project specifications. The model definition in Hapify is **agnostic** and **featured-oriented** (behavioral), which means Hapify defines what the model **should do**, not **how it will do it**.

The data-models can be edited in a local Web Console.

![Hapify GUI - models edition](../assets/gui-models.png 'Models Edition')

Note: you can import data-models provided by the Community on the [Hapify Hub](https://hub.hapify.io/).

For detailed information about data-models you can refer to the [data-models documentation](./models).

## Hapify Boilerplate

A typical Hapify boilerplate is split into two parts: 

- `Dynamic files`: Hapify meta-templates files, compatible with Hapify Data-Models and Hapify Engine.
- `Static files`: All other files, which are not related to data-models: Docker files, CSS files, Libraries, Plugins, etc.

### Channel

A channel is a group of templates. Most boilerplates only have one channel. However, a full-stack boilerplate may contain two channels, for the front-end and the back-end templates.
