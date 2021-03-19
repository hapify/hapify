## Run the `serve` command

At this stage, you have an empty channel and no data-models in your project.
In order to create new template, you need to create some models first.

Run this command:

```bash
hpf serve
```

### Add some models

Create or import templates for your project.
This step is mandatory for the next step in order to validate that your templates work.

We recommend that you add the templates that will cover the use cases you want to handle.

For example, if you plan to use `latitude` and `longitude` and process them in your templates,
Then add at least one template that has these fields.

Another common case is the relationship between models.
We also recommend that you add several relationships between your templates, even a self-referencing relationship.

!!! seealso "See also"
    To learn more about model management, please refer to [model edition](../../existing-boilerplate/step-2-edit-models).
