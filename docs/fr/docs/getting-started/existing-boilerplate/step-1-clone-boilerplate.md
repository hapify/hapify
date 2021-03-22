## Exécuter la commande `new`

Créez un nouveau dossier pour votre projet et allez dans ce dossier :

```bash
mkdir my-project && cd my-project
```

Utilisez la [commande](../../reference/cli.md#new) `new` pour cloner un boilerplate et initialiser votre projet :

```bash
hpf new
```

## Choisir un ou plusieurs boilerplates

Une fois que vous avez sélectionné un projet, vous pourrez choisir un boilerplate public (disponible sur le [Hub Hapify](https://hub.hapify.io/)) ou entrer une URL de git personnalisée.

```
? Choose a boilerplate 
  Enter a Git URL 
  ──────────────
❯ HapiJS Backend 
  NG-ZORRO Components 
  NG-ZORRO Dashboard 
  PHP Slim Backend 
```

Vous pouvez ajouter un autre boilerplate :

```
? Choose a project New one
? Choose a boilerplate HapiJS
? Add another boilerplate? (y/N)
```

Par exemple, si vous choisissez un boilerplate back-end, vous pouvez ajouter un ou plusieurs boilerplate front-end.
Si vous n'avez besoin que d'un seul boilerplate ou si vous choisissez un boilerplate full-stack, sélectionnez simplement `No`.

### Utiliser un boilerplate à partir d'un dépôt git

Si vous voulez utiliser un boilerplate qui n'est pas répertorié, choisissez l'option `Enter a Git URL` puis tapez ou collez l'URL :

```
? Choose a boilerplate Enter a Git URL
? Enter boilerplate Git URL https://github.com/someone/somerepo.git
```

Vous devez entrer une URL compatible avec `git clone`.

## Importer des modèles de données prédéfinis

Vous pouvez importer des collections de modèles de données prédéfinies ([presets](../concepts/terminology.md)) depuis Hapify Cloud.
Pour ce faire, sélectionnez un ou plusieurs presets lorsque cela vous est demandé :

```
? Choose some presets to preload in your project 
 ◉ User
 ◯ Listing
 ◯ Messaging
❯◉ Food delivery
 ◯ Shopping cart & wishlist
```

## Entrer le nom et la description

```
? Enter a project name Food delivery
? Enter a project description A food delivery app
```

## Sortie

Après quelques secondes, le boilerplate sera cloné dans votre dossier courant :

```
✓ Created 2 new dynamic boilerplates in ~/my-project.
Run hpf use to connect a remote project (optional).
Run hpf serve to edit models and templates.
Run hpf generate to generate the source code.
```

La structure des dossiers ressemble à ceci :

```
~/my-project
├── boilerplate-hapijs
|  ├── .hapify
|  |  ├── routes
|  |  └── validator.js
|  ├── Dockerfile
|  ├── hapify-models.json
|  ├── hapify.json
|  └── ...
└── boilerplate-ngx-dashboard
   ├── .hapify
   |  ├── src
   |  └── validator.js
   ├── src
   |  ├── app
   |  ├── assets
   |  ├── index.html
   |  └── ...
   ├── hapify.json
   └── ...
```

`hapify.json` est le fichier de configuration. Il contient les méta-données du boilerplate et la liste des templates.

Le fichier `hapify-models.json` contient les modèles de données de votre projet.
Il est référencé par le fichier de configuration (`hapify.json`).
Vous pouvez déplacer ou renommer ce fichier tant que vous changez le chemin dans le fichier de configuration.

Le dossier `.hapify` (peut aussi être nommé `hapify`) est le dossier des templates. Il contient tous les templates du boilerplate.

## **Facultatif** : Stocker vos modèles de données sur Hapify Cloud

Par défaut, Hapify stocke vos modèles de données localement. Le chemin d'accès est défini dans le fichier de configuration.
Vous pouvez stocker vos modèles de données en ligne, afin de les partager sur plusieurs dépôts.

Pour connecter le CLI à Hapify Cloud, veuillez suivre [ces étapes](../installation.md#cloud).

### Connecter votre boilerplate à un projet distant

Exécutez [cette commande](../../reference/cli.md#use) pour configurer votre boilerplate :

```bash
hpf use
```

#### Créer un projet

Vous pouvez créer un projet directement depuis le CLI en sélectionnant `Create a new project`.
À l'invite, entrez le nom et la description.

```
? Choose a project Create a new project
? Enter a project name First project
? Enter a project description My first project with Hapify
```

#### Sélectionnez un projet existant

Dans la liste ci-dessous, sélectionnez un projet depuis votre compte.

```
? Choose a project (Use arrow keys)
  Create a new project 
  ──────────────
❯ First project
  Second project
```

!!! tip "À savoir"
    Vous pouvez créer un projet en ligne à partir de votre compte Hapify : [https://www.hapify.io/my-projects](https://www.hapify.io/my-projects)

Le boilerplate va maintenant stocker et lire les modèles depuis Hapify Cloud.

```
? Choose a project First project
✓ Did set project 5c893c0a74e4650010e6f683 for channel HapiJS
✓ Did set project 5c893c0a74e4650010e6f683 for channel Angular Dashboard
```

L'ID du projet est stocké dans le fichier de configuration (`hapify.json`).
