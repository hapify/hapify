!!! question "Channel vs  boilerplate ?"
    Un channel est un ensemble de templates. La plupart des boilerplates n'ont qu'un seul channel.
    Cependant, un boilerplate full-stack peut contenir deux channels, un pour les templates du front-end et un pour ceux du back-end.

## Exécutez la commande `init`.

Créez un nouveau dossier pour votre projet et allez dans ce dossier :

```bash
mkdir my-project && cd my-project
```

!!! tip "Astuce"
    Vous pouvez également démarrer un channel dans un boilerplate existant.

Utilisez la commande `init` pour initialiser un channel dans ce dossier.

```bash
hpf init
```

#### Créer un projet

Vous devez créer un nouveau projet afin de créer un nouveau channel.
À l'invite, entrez le nom et la description.

```
? Enter a project name First project
? Enter a project description My first project with Hapify
```

#### Créer le channel

Une fois le projet défini, entrez les détails du channel.

```
? Enter the channel name Typescript Backend
? Enter a description API for my app
? Enter a logo URL https://cdn.worldvectorlogo.com/logos/typescript.svg
✓ Initialized a channel in /Users/edouard/workspace/hapify/my-project.
Run hpf use to connect a remote project (optional)
```

Voici la hiérarchie des fichiers créés :
    
```
~/my-project
├── .hapify
|  ├── models
|  |  └── __kebab__
|  |     └── hello.js.hpf
|  └── validator.js
├── hapify-models.json
└── hapify.json
```

`hapify.json` est le fichier de configuration. Il contient les méta-données de la plate-forme et la liste des templates.

Le fichier `hapify-models.json` contient les modèles de données de votre projet.
Il est référencé par le fichier de configuration (`hapify.json`).
Vous pouvez déplacer ou renommer ce fichier tant que vous changez le chemin dans le fichier de configuration.

Le dossier `.hapify` (peut aussi être nommé `hapify`) contient tous les templates du channel.
