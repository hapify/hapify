## Install the CLI

First step, install the CLI using NPM:

```bash
npm install -g @hapify/cli
```

Additionally you can check if the package is installed by running: `hpf --version`.

## Optional: Connect the CLI to Hapify Cloud

The Hapify CLI can interact with Hapify Cloud for project and model storage.
Therefore, you need to get an API key from Hapify Cloud to access these CLI features.

### 1. Register on Hapify Cloud

If you do not have an account yet, please visit [hapify.io/sign-up](https://www.hapify.io/sign-up).

### 2. Get your API key

Once you have registered, or if you already have an account, go to [hapify.io/my-key](https://www.hapify.io/my-key) and copy your API Key.

### 3. Configure the CLI

Run [this command](../../reference/cli/#set-global-api-key) with your API key to connect the CLI to Hapify Cloud once and for all.

```bash
hpf key XXXXXXXXXXXX
```

Now your CLI can interact with Hapify Cloud.
