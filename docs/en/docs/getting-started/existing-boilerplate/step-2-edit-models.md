## Run the `serve` command.

At this point, you have a boilerplate but no data models in your project, unless you have imported collections of predefined data models.
In order to create and modify the data models in your project, run [this command](../../reference/cli.md#serve) to launch the local GUI:

```bash
hpf serve
```

## List of data models

Once started, the GUI displays all the data models.

![Hapify GUI - Models edition](../../assets/gui-models.jpg 'Models Edition')

!!! tip "Tip"
    For projects with many data models, you can filter them by name, field name or reference. Use the top right bar.
    Press the escape key to reset these filters.

## Add and edit data models

Click on the `New model` button, enter a name and press the "Enter" key.

The new data model will be populated with the default fields.
The default fields are defined in the boilerplate configuration file (`hapify.json`).

!!! tip "Tip"
    Once created, you can change the name of the data model by clicking on it.

### Importing predefined data models

Click on the `Import collections` button, choose a collection ([preset](../terminology.md)) and validate.

![Hapify GUI - Models import](../../assets/gui-models-import-collections.jpg 'Models import')

The data models of the collection will be merged with the existing data models in case of conflict.

### Delete, clone and copy

Click on the three dots to display this menu:

![Hapify GUI - More options](../../assets/gui-models-more-options.jpg 'More options'){: style="width: 142px"}

#### Copy and paste

When you copy a data model, it is added as JSON to your clipboard.
To paste a data model, click `Paste from clipboard` at the end of the data model list.

This is useful to transfer data models between multiple projects.

## Add and edit fields

Click on `Add field` at the end of a data model and enter a name.

You can choose its type and subtype:

![Hapify GUI - Field type](../../assets/gui-models-fields-types.jpg 'Field type'){: style="width: 416px"}

And also its attributes by clicking on the gear :

![Hapify GUI - Field attributes](../../assets/gui-models-fields-attributes.jpg 'Field attributes'){: style="width: 420px"}

!!! tip "Tip"
    Once created, you can change the name of the field by clicking on it.

!!! seealso "See also"
    To learn more about field management, please refer to the [data model description](../concepts/models.md#fields).

### Delete a field

Click on the "trash" icon and select the fields to be deleted:

![Hapify GUI - Delete fields](../../assets/gui-models-fields-delete.jpg 'Delete fields'){: style="width: 374px"}

## Edit data model accesses  

Expand the access management panel by clicking on the "fingerprint" icon at the top of a model:

![Hapify GUI - Access management](../../assets/gui-models-access-managment.jpg 'Access management'){: style="width: 410px"}

!!! seealso "See also"
    For more information about access management, please refer to the [data model description](../concepts/models.md#access).
    
## Add notes

You can leave notes on the data models and their fields. Click on the "speech" icon and write a note.

**On a model:**

![Hapify GUI - Models notes](../../assets/gui-models-notes.jpg 'Models notes'){: style="width: 381px"}

**On a field:**

![Hapify GUI - Models notes](../../assets/gui-models-fields-notes.jpg 'Models notes'){: style="width: 411px"}

## Errors and warnings

A boilerplate can validate the data models you are writing.
These errors or warnings will appear when editing the data models.

![Hapify GUI - Models error](../../assets/gui-models-error.jpg 'Models error'){: style="width: 464px"}
