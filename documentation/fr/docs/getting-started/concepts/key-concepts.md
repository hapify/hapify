Hapify annihile le besoin d’écrire des boilerplates répétitif pour des opérations CRUD étendues, tant pour le développement back-end que front-end. Concentrez-vous uniquement sur les fonctionnalités métier au lieu de faire du travail répétitif !

- Hapify est un générateur de code agnostique permettant la création de tout type d'application manipulant des modèles de données, dans n'importe quel langage.

- Hapify n'impose aucun paradigme ou structure de code. Vous pouvez écrire vos propres templates de code ou utiliser ceux fournis par la communauté.

- Hapify utilise deux entrées : **modèles de données** et les **templates de code**.

## Templates

Hapify fournit une syntaxe simple mais puissante pour vous aider à créer des templates dynamiques.
Avec Hapify, vous pouvez soit

- Inverser l'ingénierie de vos propres plaques chauffantes statiques
- Utilisez des boilerplates fournis par la **[communauté](https://hub.hapify.io/)**

Pour plus d'informations sur le moteur de template, vous pouvez consulter la [documentation de la syntaxe](../../templating/hapify/syntax/) et la [documentation sur les templates](../../templating/javascript/usage/).

## Modélisation 

Hapify vous permet de définir les modèles de données qui correspondent aux spécifications de votre projet. La définition du modèle dans Hapify est **agnostique** et ** comportementales**, ce qui signifie que Hapify définit ce que le modèle de donnée **doit faire**, et non pas **comment il le fera**.

Les modèles de données peuvent être édités dans une console Web locale.

![Hapify GUI - models edition](../../assets/gui-models-access.png 'Models Edition')

Remarque : vous pouvez importer des modèles de données fournis par la communauté via [Hapify Hub] (https://hub.hapify.io/).

Pour plus d'informations sur les modèles de données, vous pouvez vous référer à la [documentation sur les modèles de données](../models/).

## Hapify Boilerplate

Un boilerplate Hapify typique est divisée en deux parties : 

- Les fichiers dynamiques : Fichiers des templates Hapify, compatibles avec les modèles de données Hapify et le moteur Hapify.
- Fichiers statiques : Tous les autres fichiers, qui ne sont pas liés aux modèles de données : Fichiers Docker, fichiers CSS, bibliothèques, plugins, etc.

### Channel

Un channel est un ensemble de templates. La plupart des boilerplates n'ont qu'un seul channel. Cependant, un boilerplate full-stack peut contenir deux channels, un pour les templates du front-end et un pour ceux du back-end.
