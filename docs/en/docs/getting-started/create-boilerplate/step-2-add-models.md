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

## Default fields

You can define default fields that will be added to any new data model.
These fields are not binding, the user can modify or delete them if he/she wants.
This is useful to define the primary key of your data models for example.

The default fields are defined in the `hapify.json` file:

```json
{
  "defaultFields": [
    {
      "name": "Id",
      "type": "string",
      "properties": ["primary", "internal"]
    }
  ]
}
```

To get these default fields, you can create a data model that contains only the desired default fields.
Then open the `hapify-models.json` file, and copy the fields from that data model:

```json
{
  "fields": [
    {
      "name": "id",
      "type": "number",
      "properties": ["primary", "internal"]
    }
  ]
}
```

Finally, paste this into the `hapify.json` file at the `defaultFields` line.

!!! warning "Warning"
    Changes to the `hapify.json` file are not reflected on the fly. You must rerun the `hpf serve` command.
