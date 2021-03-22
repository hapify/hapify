## Description

Hapify est un outil de génération de code basé sur des modèles de données relationnels.
Il utilise un langage de templating dédié.
Il affiche une console web pour la définition des modèles de données et l'écriture des templates.

## Utilisation

### Installation

Vous devez installer ce package globalement pour obtenir la commande `hpf` :

```bash
npm install -g @hapify/cli
```

Pour vérifier la version installée, exécutez `hpf --version`.

### Options globales

- `-V`, `--version` : affiche le numéro de version
- `--debug` : active le mode débogage (par défaut : `false`)
- `--silent` : active le mode silencieux (par défaut : `false`)
- `-d <path>`, `--dir <path>` : change le répertoire de travail. Ce chemin peut être absolu ou relatif au chemin courant.
- `-k <secret>`, `--key <secret>` : force l'utilisation d'une clé API plutôt que celle définie dans la configuration globale. Si vous voulez définir votre clé d'API de façon permanente, vous devriez utiliser la commande `hpf key`.
- `-h`, `--help` : affiche l'aide

### Commandes

#### <a name="config"></a>Définir la configuration globale

```bash
hpf config [options]
```

Cette commande enregistre une ou plusieurs configurations globales dans `~/.hapify/config.json`.
Si le fichier n'existe pas, il sera automatiquement créé.

_Configuration disponible_

- `hpf config --apiKey <secret>` : définit la clé d'API à utiliser pour chaque commande. Ceci est équivalent à `hpf key <key>`.
- `hpf config --apiUrl <url>` : remplace l'URL d'API par défaut.

#### <a name="key"></a>Définir la clé d'API globale

```bash
hpf key <key>
```

Cette commande est un alias de `hpf config --apiKey <secret>`.

####  <a name="list"></a>Lister les boilerplates (channels)

```bash
hpf list
```

Alias : `hpf ls`

Cette commande affiche ce qui est visible pour le CLI à partir du répertoire courant.
Elle affiche la liste des [channels](../getting-started/concepts/terminology.md) et la liste des modèles de données utilisés par ces channels.

Le CLI recherche les fichiers `hapify.json` afin de détecter automatiquement les channels.
Il réitère sur les sous-répertoires. La profondeur par défaut est de `2`.
Pour modifier cette valeur, utilisez l'option `depth`.

```bash
hpf list --depth 3
```

!!! warning "Attention"
    Vous n'êtes pas censé exécuter le CLI avec des ensembles de modèles de données différents.
    Si c'est le cas, le premier ensemble trouvé sera utilisé.

#### <a name="generate"></a>Générer le code

```bash
hpf generate
```

Alias : `hpf g`

Cette commande génère tous les channels trouvés à partir de leurs templates et modèles de données.
Pour définir la profondeur de la recherche de channels, utilisez cette option : `--depth <n>`. La valeur par défaut est `2`.

```bash
hpf generate --depth 3
```

!!! tip "À savoir"
    Les fichiers générés vides ne seront pas sauvegardés.

#### <a name="export"></a>Exporter le code

```bash
hpf export
```

Alias : `hpf x`

Cette commande génère un channel à partir de ses templates et de ses modèles de données puis sauvegarde les fichiers générés dans un fichier zip.
Vous devez lancer cette commande à partir du répertoire du channel, au niveau du fichier `hapify.json`.

Par défaut, le fichier zip porte le nom du dossier du channel.
Exemple : `angular-admin/angular-admin.zip`.
Vous pouvez définir un chemin personnalisé avec cette option : `-o, --output <path>`.

```bash
hpf export -o /path/to/file.zip
```

!!! tip "À savoir"
    Les fichiers générés vides ne seront pas sauvegardés.

#### <a name="import"></a>Importez des modèles de données

```bash
hpf import
```

Alias : `hpf m`

Utilisez cette commande pour importer des modèles de données prédéfinis depuis Hapify Cloud (appelés [presets](../getting-started/concepts/terminology.md)).

_Importer des presets à partir d'ID_

Vous pouvez également importer des préréglages à partir de leurs ID (visibles sur [Hapify Hub](https://hub.hapify.io/))

```bash
hpf import --preset ab123 --preset bd456
```

#### <a name="new"></a>Cloner un boilerplate et démarrer un nouveau projet

```bash
hpf new
```

Alias : `hpf n`

Cette commande vous permet de cloner et de configurer un boilerplate.
Elle vous demandera de :

-   sélectionner un boilerplate
-   sélectionner ou créer le projet à utiliser
-   sélectionner des [presets](../getting-started/concepts/terminology.md) de modèles de données à importer

_Options_

-   `-p <id>`, `--project <id>`: Le projet à utiliser (s'il existe déjà)
-   `-b <slug>`, `--boilerplate <slug>` : Le slug du boilerplate à cloner
-   `--boilerplate-id <id>` : L'ID du boilerplate à cloner
-   `--boilerplate-url [url]` : Les URL git des boilerplates à cloner
-   `--preset [id]` : ID des presets à précharger dans le projet
-   `--no-presets` : Ne pas demander de presets
-   `--project-name <name>` : Le nom du projet à créer
-   `--project-desc <description>` : La description du projet à créer (le nom doit être défini)

Pour consulter les presets disponibles, visitez [hub.hapify.io](https://hub.hapify.io).

#### <a name="init"></a>Créer un nouveau boilerplate/channel

```bash
hpf init
```

Alias : `hpf i`

Cette commande crée une nouvelle structure de fichiers Hapify dans le répertoire courant.
Elle crée 2 fichiers `hapify.json`, `hapify-models.json` et un dossier `.hapify` contenant un template `models/__kebab__/hello.js.hpf`.
Elle vous demandera de sélectionner ou de créer un projet.

_Options_

-   `--channel-name <name>` : Le nom du channel à initialiser
-   `--channel-desc <description>` : La description du channel à initialiser
-   `--channel-logo <url>` : L'URL du logo du channel à initialiser
-   `--project-name <name>` : Le nom du projet à créer
-   `--project-desc <description>` : La description du projet à créer

#### <a name="use"></a>Définir le projet à utiliser dans un boilerplate/channel

```bash
hpf use
```

Alias : `hpf u`

Change le projet utilisé par un ou plusieurs [channels](../getting-started/concepts/terminology.md) existants.
Change l'ID du projet dans le fichier `hapify.json` pour chaque channel trouvé.
Elle vous demandera de sélectionner ou de créer le projet à utiliser.

_Options_

-   `-p <id>`, `--project <id>` : Le projet à utiliser (s'il est déjà créé)
-   `--project-name <name>` : Le nom du projet à créer
-   `--project-desc <description>` : La description du projet à créer

#### <a name="patch"></a>Appliquer un patch au code généré avec de nouveaux modèles de données

Au cours du processus de développement, vous pouvez ajouter, modifier ou supprimer certains modèles.
Pour fusionner automatiquement la différence entre deux générations à votre branche de travail, utilisez cette commande.

Cette commande utilise `git format-patch` et `git am`.

```bash
hpf patch
```

Elle vous permettra de choisir la branche source et le commit, puis la branche de destination.

#### <a name="serve"></a>Démarrer la console

Exécutez cette commande pour modifier les modèles de données et les templates.

```bash
hpf serve
```

Ceci démarrera une console web pour l'édition des modèles de données et des templates.

_Options_

-   `-p <n>`, `--port <n>` : Le port requis (par défaut entre `4800` et `4820`)
-   `-H <hostname>`, `--hostname <hostname>` : Le nom d'hôte requis (par défaut : `localhost`)
-   `--no-open` : Ne pas ouvrir un nouvel onglet dans le navigateur pour afficher la console
-   `--depth <n>` : Profondeur pour la recherche de channels (par défaut : `2`)
