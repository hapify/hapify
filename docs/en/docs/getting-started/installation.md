## Installing the CLI

The first step is to install the CLI using NPM :

```bash
npm install -g @hapify/cli
```

You can also check if the package is installed by running: `hpf --version`.

## <a name="cloud"></a>**Optional**: Connect CLI to Hapify Cloud

The Hapify CLI can interact with Hapify Cloud to store your projects and their models.
To do this, you need to get an API key from Hapify Cloud.

### 1. Sign up for Hapify Cloud

If you do not have an account yet, please visit [hapify.io/sign-up](https://www.hapify.io/sign-up).

### 2. Get your API key

Once you have registered, or if you already have an account, go to [hapify.io/mykey](https://www.hapify.io/my-key) and copy your API key.

### 3. Configure the CLI

Run [this command](../reference/cli.md#key) with your own API key to connect the CLI to Hapify Cloud.

```bash
hpf key XXXXXXXXXXXX
```

Your CLI can now interact with Hapify Cloud.
