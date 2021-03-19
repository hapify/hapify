Maintenant que vous avez ajouté quelques modèles de données pour servir de guide au développement des templates, vous pouvez commencer à écrire des templates.

## Sélection du boilerplate

Rendez-vous dans l'interface graphique (commande `hpf serve`). Cliquez sur l'onglet `Boilerplates` et sélectionnez le boilerplate précédemment créé. Cliquez sur `Edit boilerplate`.

![Hapify GUI - Boilerplate selection](../../assets/gui-boilerplate-list.jpg 'Boilerplate selection'){: style="width: 722px"}

## Liste des templates

Vous arrivez maintenant sur cette page:

![Hapify GUI - Boilerplate templates](../../assets/gui-boilerplate-templates.jpg 'Boilerplate templates'){: style="width: 1060px"}

La barre latérale gauche expose tous les templates présents dans votre dossier en les organisant par dossiers. A droite, un aperçu des templates disponible dans le dossier sélectionné à gauche.

### Ajout d'un template

Cliquez sur `New path` en dessous d'un dossier puis entrez un chemin de fichier pour créer un nouveau template.

!!! tip "À savoir"
	Vous pouvez ajouter des `/` dans le nom du template pour créer des dossiers parents: `path/to/template.ts`

#### Nom de template dynamique

Vous pouvez créer un nom de template dynamique en fonction du nom du modèle: `path/to/{camel}.ts`. 

Si vous avez trois modèles: `user`, `user profile` et `listing`, alors ce template donnera naissance à trois fichiers: `path/to/user.ts`, `path/to/userProfile.ts` et `path/to/listing.ts`.

Les casses disponible sont:

- `{camel}` exemple : `userProfile`
- `{pascal}` exemple : `UserProfile`
- `{lower}` exemple : `user profile`
- `{capital}` exemple : `User Profile`
- `{kebab}` exemple : `user-profile`
- `{header}` exemple : `User-Profile`
- `{snake}` exemple : `user_profile`
- `{constant}`  exemple : `USER_PROFILE`
- `{compact}` exemple : `userprofile`
- `{raw}` exemple : `User profile` (for the original name)

!!! warning "Attention"
    Les noms dynamiques ne fonctionnent que pour les templates de type `one model`

#### Modifier le nom d'un template

Cliquez sur le nom dans la partie gauche et modifiez-le:

![Hapify GUI - Boilerplate template name](../../assets/gui-boilerplate-template-name.jpg 'Boilerplate template name'){: style="width: 478px"}

#### Supprimer un template

Survoler le nom dans la barre de gauche et cliquez sur l'icône "supprimer"

![Hapify GUI - Boilerplate template name](../../assets/gui-boilerplate-template-delete.jpg 'Boilerplate template name'){: style="width: 300px"}

#### Choisir le moteur de template

Plusieurs moteurs de template sont disponibles. Nous

![Hapify GUI - Boilerplate template engine](../../assets/gui-boilerplate-template-engine.jpg 'Boilerplate template engine'){: style="width: 279px"}

#### Choisir le type d'entrée

Un template peut recevoir en entrée **un** modèle de données ou alors **tous** les modèles de données.

Au cours de la génération, s'il est défini comme `one`, le template sera appelé une fois pour chaque modèle de données. Par conséquent, il engendrera un fichier pour chaque modèle de données.
S'il est défini comme `all`, le template sera appelé une seule fois pour tous les modèles de données. Il engendrera alors un unique fichier.

![Hapify GUI - Boilerplate template input](../../assets/gui-boilerplate-template-input.jpg 'Boilerplate template input'){: style="width: 192px"}

### Éditeur de template

Pour accéder à l'éditeur de template, survoler un template dans la liste de droite et cliquez sur `Open editor`

![Hapify GUI - Boilerplate template open editor](../../assets/gui-boilerplate-template-open-editor.jpg 'Boilerplate template open editor'){: style="width: 667px"}

Sur la partie gauche se trouve le code du template, que vous pouvez modifier. À droite, un aperçu du rendu du template pour le modèle de données sélectionné.

De même, dans la barre de navigation se trouve le chemin du template et le chemin du fichier généré.

![Hapify GUI - Boilerplate template editor](../../assets/gui-boilerplate-template-editor.jpg 'Boilerplate template editor'){: style="width: 1113px"}

!!! tip "À savoir"
    Vous pouvez modifier directement le chemin du template dans la barre de navigation.

!!! tip "À savoir"
    Il est possible de générer automatiquement les fichiers cibles lorsque vous sauvegardez votre template en cliquant sur l'icône du marteau.

!!! warning "Attention"
    La sélection des modèles de données n'est présente que pour les templates de type `one model`

