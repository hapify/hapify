# Best practices

## Hapify & Git patches

To be able to use properly the command `hpf patch`, you should run the generation on a separate branch.
For example, create a branch called `hapify`.

### First generation

Go on this fresh new branch `hapify`.
Run your first generation using `hpf generate`.

If you are using a code formatter/beautifier, run it after each generation.

Commit this. Let's call it `Generation 1`.

Merge the branch `hapify` into your working branch, let's say `develop`.

Now you can start working on `develop` and customize the generated code.

### Second generation

Oh no! You forgot something in your models, or the project specifications have changed, or you want to edit some lines in your templates.

If you are using a code formatter/beautifier, run it in your working branch (`develop` for example).

Switch to branch `hapify`.
Edit your models and/or templates.
Run the generation and run your code formatter/beautifier (if any).

Commit this. Let's call it `Generation 2`.

### Apply the diff

Now you can run the command `hpf patch` to compute the diff between commits `Generation 1` and `Generation 2` and apply it to `develop`.

```
$ hpf patch
? Choose a source branch hapify
? Choose the first commit [2018-10-19 17:56:40 -0400] Generation 1
? Choose the second commit [2018-10-22 01:47:18 -0400] Generation 2
? Choose a destination branch develop
```

Before doing anything, this will display the git command that will executed, and ask for confirmation.
This should look like this:

```
git format-patch --stdout e5d01ec559aa79b0af8f80839e22e15f3283c752..be93268f6d404c4c7c83c55a6dcb98f4930a0c1c | git am -3 -k
```

If an error occurred during this git command, this is probably due to a merge conflict.

If so, open your code editor and resolve the conflict. Once it is done, run `git am --continue` to finalize or `git am --abort` to cancel the merge.

