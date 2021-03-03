## Run the `serve` command

At this stage, you have an empty channel and no data-models in your project.
In order to create new template, you need to create some models first.

Run this command:

```bash
hpf serve
```

### Add some models

Create or import some models to your project.
This is mandatory for the next step in order to validate that your templates are working.

We recommend that you add models that covers the uses cases you want to handle.

For example, if you do care about `latitude` and `longitude` and you planned to deal with it in your templates,
then add at least one models that have those fields.

Another recurrent case is the relations between models.
We also recommend that you add some relations between your models, even a self-reference relation.

!!! seealso
    To learn more models management please refer to [model edition](../../existing-boilerplate/step-2-edit-models).
