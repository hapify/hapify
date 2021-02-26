## Run the `generate` command

Once your models are ready, you will be able to generate the code with this command:

```bash
hpf generate
```

This will run the generator and copy the generated files into your local boilerplate:

```bash
• Found channel HapiJS in ~/my-project/boilerplate-hapijs
• Found channel Angular Dashboard in ~/my-project/boilerplate-ngx-dashboard
✓ Generated 60 files for channel HapiJS
✓ Generated 189 files for channel Angular Dashboard
```

Now you can start customizing and running the generated code.

!!! tip inline end
    The `generate` command can handle multiple boilerplates at once.
    To learn mode about the `generate` command please refer to [this article](../../../reference/cli/#generate-the-code).


## Format the code

Hapify does not format the output code. This task is delegated to the boilerplate itself.
We strongly recommend that you run the linter embedded in the boilerplate if any or use the code formatter from your IDE.
