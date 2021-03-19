## Installer le CLI

La première étape consiste à installer le CLI en utilisant NPM :

```bash
npm install -g @hapify/cli
```

En plus, vous pouvez vérifier si le paquet est installé en exécutant : `hpf --version`.

## **Facultatif** : Connecter le CLI à Hapify Cloud

Le CLI Hapify peut interagir avec Hapify Cloud pour le stockage de projets et de modèles.
Par conséquent, vous devez obtenir une clé API de Hapify Cloud pour accéder à ces fonctionnalités de la CLI.

### 1. S'inscrire sur Hapify Cloud

Si vous n'avez pas encore de compte, veuillez consulter le site [hapify.io/sign-up](https://www.hapify.io/sign-up).

### 2. Obtenez votre clé API

Une fois inscrit, ou si vous avez déjà un compte, allez sur [hapify.io/mykey](https://www.hapify.io/my-key) et copiez votre clé API.

### 3. Configurer le CLI

Exécutez [cette commande](../reference/cli.md#definir-la-cle-dapi-globale) avec votre propre clé API pour connecter le CLI à Hapify Cloud une fois pour toutes.

```bash
hpf key XXXXXXXXXXXX
```

Votre CLI peut maintenant interagir avec Hapify Cloud.
