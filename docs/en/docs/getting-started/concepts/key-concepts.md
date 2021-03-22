Hapify automates the writing of CRUD operations for both back-end and front-end development.
Focus only on business features instead of doing repetitive work!

- Hapify is an agnostic code generator for any type of application manipulating data models, in any language.
- Hapify works with any paradigm or code structure. You can write your own code templates or use those provided by the community.
- Hapify takes two inputs: **data models** and **code templates**.

## Templating

Hapify provides a simple but powerful syntax to help you create dynamic boilerplates.
Using Hapify you can either:

- [Convert your own boilerplates](../create-boilerplate/introduction.md) into dynamic boilerplates.
- [Use boilerplates](../existing-boilerplate/introduction.md) provided by the **[community](https://hub.hapify.io/)**

!!! seealso "See also"
    For more information about template engines, refer to the [Hapify syntax documentation](../../reference/hapify-syntax.md) and the [EJS and JavaScript templates documentation](../../reference/ejs-javascript.md).

## Data modeling 

Hapify lets you define the data models that fit your project specifications. The model definition in Hapify is **agnostic** and **featured-oriented** (behavioral), which means Hapify defines what the model **should do**, not **how it will do it**.

The data models can be edited in a local web console.

![Hapify GUI - models edition](../../assets/gui-models-access.jpg 'Models Edition')

!!! tip "Tip"
    You can import data models provided on the [Hapify Hub](https://hub.hapify.io/).

!!! seealso "See also"
    For more information on data models, you can refer to [this](./models.md).

## Hapify Boilerplate

A typical Hapify [boilerplate](../terminology.md) is divided into two parts: 

- Dynamic files: Hapify template files, compatible with Hapify data models and the Hapify engine.
- Static files: All other files, which are not related to data models: Docker files, CSS files, libraries, plugins, etc.

### Channel

A [channel](../terminology.md) is a set of templates. Most boilerplates have only one channel. However, a full-stack boilerplate can contain two channels, one for front-end templates and one for back-end templates.
