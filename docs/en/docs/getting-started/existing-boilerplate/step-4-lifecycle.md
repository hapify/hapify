## Hapify & Git patch

Hapify allows you to regenerate the [target code](../terminology.md) without overwriting any changes you may have made.
This feature is based on the `git format-patch` and `git am` commands.
This way you can use Hapify throughout your project, not just at startup.

### Preparing the repository

To be able to use [the command](../../reference/cli.md#patch) `hpf patch` properly, you must run the generation on a separate branch.
For example, create a branch named `hapify`.

### First generation

Go to this new `hapify` branch.
Run your first generation using `hpf generate`.

If you are using a code formatter, run it after each generation.

Commit this. Let's call it `Generation 1`.

Merge the `hapify` branch into your working branch, let's say `develop`.

Now you can start working on `develop` and customize the generated code.

### Second generation

Oh no! You forgot something in your data models, the project specifications have changed, or you want to edit some lines in your templates.

If you are using a code formatter, run it on your working branch (`develop` for example).

Switch to the `hapify` branch.
Edit your data models and/or templates.
Start the generation and run your code formatter (if any).

Commit it. Let's call it `Generation 2`.

### Apply the difference

You can now run the `hpf patch` command to calculate the difference between the `Generation 1` and `Generation 2` commits and apply it to `develop`.

```
$ hpf patch
? Choose a source branch hapify
? Choose the first commit [2018-10-19 17:56:40 -0400] Generation 1
? Choose the second commit [2018-10-22 01:47:18 -0400] Generation 2
? Choose a destination branch develop
```

Before doing anything, it will display the git command that will be executed, and ask for confirmation.
It should look like this:

```
git format-patch --stdout e5d01ec559aa79b0af8f80839e22e15f3283c752..be93268f6d404c4c7c83c55a6dcb98f4930a0c1c | git am -3 -k
```

If an error occurred during this git command, it is probably due to a merge conflict.

If this is the case, open your code editor and resolve the conflict. Once that's done, run `git am --continue` to finalize or `git am --abort` to cancel the merge.

