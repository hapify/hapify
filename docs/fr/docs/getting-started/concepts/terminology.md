Hapify utilise des termes spécifiques pour décrire ses concepts.

- **boilerplate**: Un boilerplate est une base d'application. C'est en partant de celui-ci que vous allez bâtir une nouvelle application. Il est composé de fichiers statiques et de fichiers dynamiques.
- **fichier dynamique**: Fichier qui est généré par Hapify via un template et des modèles de données.
- **fichier statique** : Tout autre fichier qui n'est pas généré : Exemple: fichiers Docker, fichiers CSS, bibliothèques, plugins, etc.
- **template**: Fichier contenant un méta-code permettant de générer du code cible. Il existe plusieurs moteurs de templates, chacun pouvant interpréter un méta-code différent.
- **channel**: Ensemble de templates. La plupart des boilerplates n'ont qu'un seul channel. Cependant, un boilerplate full-stack peut contenir deux channels, un pour les templates du front-end et un pour ceux du back-end.
- **modèle**: Modèle de donnée relationnel décrivant les spécifications d'un projet.
- **champ**: Entrée d'un modèle de données.
- **type de champ**: Propriété d'un champ décrivant son type de données. Exemple: texte, booléen, nombre, etc.
- **attribut de champ**: Propriété d'un champ décrivant son comportement. Exemple: recherchable, masqué, etc.
- **projet**: Application définie par une liste de modèles de données.
- **code cible**: Code source généré par la rencontre d'un template et d'un ou plusieurs modèles de données. C'est le code source utilisé par l'application finale.
- **méta-code**: Code source du template. Ce code va décrire comment générer le code cible à partir d'un ou plusieurs modèles de données.
- **preset**: Collection de modèles de données prédéfinie pouvant être importée au démarrage d'un projet.
- **action**: Opération pouvant être effectuée sur une entité: _Create_, _Read_, _Update_, _Delete_, _Search_, _Count_.
