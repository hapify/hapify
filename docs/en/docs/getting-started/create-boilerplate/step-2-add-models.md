## Run the `serve` command.

At this point, you have an empty channel and no data models in your project.
In order to create a new template, you must first create some data models.

Run [this command](../../reference/cli.md#serve):

```bash
hpf serve
```

### Add data models

Create or import data models for your project.
This step is mandatory for the following step in order to validate that your templates work.

We recommend that you add the data models that will cover the use cases you want to handle.

For example, if you plan to handle `latitude` and `longitude` in your templates, then add at least one data model that includes these fields.

Another common case is relationships between data models.
We recommend that you add several relationships between your data models, even a self-referencing relationship.

!!! seealso "See also"
    To learn more about data model management, please refer to the section [editing data models](../existing-boilerplate/step-2-edit-models.md).
