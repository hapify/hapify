## Run the `serve` command

At this stage, you have a fresh boilerplate but no data-models in your project, unless you have imported pre-defined models.
In order to create or edit the models of your project, run this command to start the local GUI:

```bash
hpf serve
```

## Models list

Once started the GUI display all models.

![Hapify GUI - Models edition](../../assets/gui-models.jpg 'Models Edition')

!!! tip inline end
    For large projects, you can filter models by name, field name or reference. Use the top right bar.
    Press escape key to reset filters.

## Add and edit models

Click on `New model` button, enter a name and press enter.

The new model will be populated with default fields.
Default fields are defined in the config file of the boilerplate (`hapify.json`).

!!! tip inline end
    Once created, you can edit model's name by clicking on it.

### Import pre-defined models

Click on `Import collections` button, choose a collection and validate.

![Hapify GUI - Models import](../../assets/gui-models-import-collections.jpg 'Models import')

Collection's models will be merged with existing models in case of conflict.

### Delete, clone and copy

Click on the three dots to expand this menu:

![Hapify GUI - More options](../../assets/gui-models-more-options.jpg 'More options'){: style="max-width: 142px"}

#### Copy & paste

When copying the models, it adds the models as a JSON in your clipboard.
To paste a model, click on `Paste from clipboard` at the end of the models list.

This is useful to copy/paste models between multiple projects.

## Add and edit fields

Click on `Add field` at the end of a model and enter a names.

You can choose its type and sub-type:

![Hapify GUI - Field type](../../assets/gui-models-fields-types.jpg 'Field type'){: style="max-width: 416px"}

And also its attributes by clicking on the gear:

![Hapify GUI - Field attributes](../../assets/gui-models-fields-attributes.jpg 'Field attributes'){: style="max-width: 420px"}

!!! tip inline end
    Once created, you can edit filed's name by clicking on it.

!!! seealso inline end
    To learn more about fields management please refer to [model's concepts](../../concepts/models/#model-properties).

### Delete a field

Click on the trash icon and select fields to remove:

![Hapify GUI - Delete fields](../../assets/gui-models-fields-delete.jpg 'Delete fields'){: style="max-width: 374px"}

## Edit model access

Expand the access managment panel by clicking on the fingerprint icon on top of a model:

![Hapify GUI - Access management](../../assets/gui-models-access-managment.jpg 'Access management'){: style="max-width: 410px"}

!!! seealso inline end
    To learn more about access management please refer to [model's concepts](../../concepts/models/#access-management).
    
## Add notes

You can leave notes on both models and fields. Click on the chat icon and write a note.

**On a model:**

![Hapify GUI - Models notes](../../assets/gui-models-notes.jpg 'Models notes'){: style="max-width: 381px"}

**On a field:**

![Hapify GUI - Models notes](../../assets/gui-models-fields-notes.jpg 'Models notes'){: style="max-width: 411px"}


