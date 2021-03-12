Hapify utilise des termes spécifiques pour décrire ses concepts.

- **boilerplate**: Un boilerlate est une base d'application. C'est en partant de celui-ci que vous allez commencer une nouvelle application. Il est composé de fichiers statiques et de fichiers dynamiques.
- **fichier dynamique**: Fichier qui est généré par Hapify via un template et des modèles de données.
- **fichier statique** : Tout autre fichier qui n'est pas généré : Exemple: fichiers Docker, fichiers CSS, bibliothèques, plugins, etc.
- **template**: Fichier contenant un meta-code permettant de générer du code cible. Il existe plusieurs moteurs de template, chacun pouvant interpréter un meta-code différent.
- **channel**: Ensemble de templates. La plupart des boilerplates n'ont qu'un seul channel. Cependant, un boilerplate full-stack peut contenir deux channels, un pour les templates du front-end et un pour ceux du back-end.
- **modèle**: Modèle de donnée relationnel décrivant les spécifications d'un projet.
- **champ**: Propriété d'un modèle de données.
- **attribut de champ**: Propriété d'un champ décrivant son comportement. Exemple: cherchable, masqué, etc.
- **projet**: Application définie par une liste de modèles de données.
- **code cible**: Le code source généré par la rencontre d'un template et d'un (ou plusieurs) modèle de données. C'est le code source utilisé par l'application finale.
- **meta-code**: Le code source du template. Ce code va décrire comment généré le code cible à partir d'un modèle de données.
