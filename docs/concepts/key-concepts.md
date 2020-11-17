# Key concepts

Hapify removes the need to write repeating boilerplate for extended CRUD operations for both backend & frontend development. Focus on features instead of doing repetitive work !

- Hapify is an agnostic code engine & tools allowing the creation of any kind of API based app, in any language

- Hapify does not command any paradigm or code structure. You can write your own code templates or use the ones provided by the community.

- Hapify takes two inputs; **relational data-models** and **meta-templates**.


## Templating

Hapify provides a simple but powerful syntax to help you creates dynamic boilerplates.
Using Hapify you can either:

- **Reverse Engineer** your own Statics Boilerplates
- Use **[Community Boilerplates](https://hub.hapify.io/)**

For detailed information about templating you can refer to [Syntax Documentation](../templating/hapify) and [Templating Documentation](../templating/javascript) 


## Modeling 

Hapify let you define the data-models that fit your project specifications. The model definition in Hapify is **agnostic** and **featured-oriented** (behavioral), which means Hapify defines what the model **should do**, not **how it will do it**.


The data-models can be edited in a local Web Console.

![Hapify GUI - models edition](../assets/gui-models.png 'Models Edition')

Note: you can import data models provided by the Community on the [Hapify Hub](https://hub.hapify.io/)

For detailed information about data models you can refer to [Data Models Documentation](./models) 



## Hapify Boilerplate

A typical Hapify boilerplate is splited into two parts: 

- `Dynamic files`: Hapify meta-templates files, compatible with Hapify Data-Models and Hapify Engine.
- `Static files`: Every other files, which are not related to data-models: Docker files, CSS files, Libraries, Plugins, etc...


### Channel

A channel is a group of templates. Most boilerplates have only one channel. However a full-stack boilerplate may contains two channels, for the front-end and the back-end templates.
