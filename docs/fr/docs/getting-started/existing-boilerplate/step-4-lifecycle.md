## Hapify & Git patch

Hapify permet de régénérer le [code cible](../terminology.md) sans écraser les modifications que vous avez pu y apporter.
Cette fonctionnalité se base sur les commandes `git format-patch` et `git am`.
Vous pouvez ainsi utiliser Hapify tout au long de votre projet et non pas en démarrage seulement.

### Préparation du dépôt

Pour pouvoir utiliser correctement [la commande](../../reference/cli.md#appliquer-un-patch-au-code-source-avec-de-nouveaux-modeles-de-donnees) `hpf patch`, vous devez lancer la génération sur une branche séparée.
Par exemple, créez une branche nommée `hapify`.

### Première génération

Allez sur cette nouvelle branche `hapify`.
Exécutez votre première génération en utilisant `hpf generate`.

Si vous utilisez un formateur de code, exécutez le après chaque génération.

Commitez ceci. Appelons-le `Génération 1`.

Fusionnez la branche `hapify` dans votre branche de travail, disons `develop`.

Maintenant vous pouvez commencer à travailler sur `develop` et personnaliser le code cible généré.

### Deuxième génération

Oh non ! Vous avez oublié quelque chose dans vos modèles de données, les spécifications du projet ont changé, ou vous voulez modifier quelques lignes dans vos templates.

Si vous utilisez un formateur de code, lancez-le dans votre branche de travail (`develop` par exemple).

Passez sur la branche `hapify`.
Modifiez vos modèles de données et/ou templates.
Lancez la génération et exécutez votre formateur de code (s'il y en a un).

Commitez le tout. Appelons-le `Génération 2`.

### Appliquez la différence

Vous pouvez maintenant lancer la commande `hpf patch` pour calculer la différence entre les commits `Génération 1` et `Génération 2` et l'appliquer à `develop`.

```
$ hpf patch
? Choose a source branch hapify
? Choose the first commit [2018-10-19 17:56:40 -0400] Generation 1
? Choose the second commit [2018-10-22 01:47:18 -0400] Generation 2
? Choose a destination branch develop
```

Avant de faire quoi que ce soit, cela affichera la commande git qui sera exécutée, et demandera une confirmation.
Cela devrait ressembler à ceci :

```
git format-patch --stdout e5d01ec559aa79b0af8f80839e22e15f3283c752..be93268f6d404c4c7c83c55a6dcb98f4930a0c1c | git am -3 -k
```

Si une erreur s'est produite pendant cette commande git, c'est probablement dû à un conflit de fusion.

Si c'est le cas, ouvrez votre éditeur de code et résolvez le conflit. Une fois que c'est fait, lancez `git am --continue` pour finaliser ou `git am --abort` pour annuler la fusion.

