## Run the `generate` command

When your data models are ready, generate the code with [this command](../../reference/cli.md#generate):

```bash
hpf generate
```

This will launch the generator and copy the generated files to your boilerplate locally:

```
• Found channel HapiJS in ~/my-project/boilerplate-hapijs
• Found channel Angular Dashboard in ~/my-project/boilerplate-ngx-dashboard
✓ Generated 60 files for channel HapiJS
✓ Generated 189 files for channel Angular Dashboard
```

You can now start customizing and using the generated code.

!!! tip "Tip"
    The `generate` command can handle multiple [boilerplates or channels](../concepts/terminology.md) at once.
    To learn more about the `generate` command, please refer to [this article](../../reference/cli.md#generate).

## Format the code

Hapify does not format the output code. This task is delegated to the boilerplate itself.
We strongly recommend that you use the boilerplate's built-in linter, if available, or use the code formatter from your IDE.

