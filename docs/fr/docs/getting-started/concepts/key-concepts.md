Hapify automatise l'écriture des opérations CRUD, tant pour le développement back-end que front-end.
Concentrez-vous uniquement sur les fonctionnalités métiers au lieu de faire du travail répétitif !

- Hapify est un générateur de code agnostique permettant la création de tout type d'application manipulant des modèles de données, dans n'importe quel langage.
- Hapify n'impose aucun paradigme ou structure de code. Vous pouvez écrire vos propres templates de code ou utiliser ceux fournis par la communauté.
- Hapify utilise deux entrées : **modèles de données** et les **templates de code**.

## Templates

Hapify fournit une syntaxe simple mais puissante pour vous aider à créer des templates dynamiques.
Avec Hapify, vous pouvez soit :

- [Convertir vos propres boilerplates](../create-boilerplate/introduction.md) en boilerplates dynamiques.
- [Utilisez des boilerplates](../existing-boilerplate/introduction.md) fournis par la **[communauté](https://hub.hapify.io/)**

!!! seealso "Voir aussi"
    Pour plus d'informations sur les moteurs de template, vous pouvez consulter la documentation de la [syntaxe Hapify](../../reference/hapify-syntax.md) et celle des [templates EJS et JavaScript](../../reference/ejs-javascript.md).

## Modélisation 

Hapify vous permet de définir les modèles de données qui correspondent aux spécifications de votre projet. La définition du modèle dans Hapify est **agnostique** et **comportementales**, ce qui signifie que Hapify définit ce que le modèle de données **doit faire**, et non pas **comment il le fera**.

Les modèles de données sont gérés dans une console Web locale.

![Hapify GUI - models edition](../../assets/gui-models-access.jpg 'Models Edition')

!!! tip "À savoir"
    Vous pouvez importer des modèles de données fournis dans [Hapify Hub](https://hub.hapify.io/).

!!! seealso "Voir aussi"
    Pour plus d'informations sur les modèles de données, vous pouvez vous référer [ici](./models.md).

## Hapify Boilerplate

Un [boilerplate](../terminology.md) Hapify typique est divisée en deux parties : 

- Les fichiers dynamiques : Fichiers des templates Hapify, compatibles avec les modèles de données Hapify et le moteur Hapify.
- Fichiers statiques : Tous les autres fichiers, qui ne sont pas liés aux modèles de données : Fichiers Docker, fichiers CSS, bibliothèques, plugins, etc.

### Channel

Un [channel](../terminology.md) est un ensemble de templates. La plupart des boilerplates n'ont qu'un seul channel. Cependant, un boilerplate full-stack peut contenir deux channels, un pour les templates du front-end et un pour ceux du back-end par exemple.
