## Exécuter la commande `serve`.

À ce stade, vous disposez d'un boilerplate mais pas de modèles de données dans votre projet, sauf si vous avez importé des modèles de données prédéfinis.
Afin de créer et de modifier les modèles de données de votre projet, exécutez cette commande pour lancer l'interface graphique locale :

```bash
hpf serve
```

## Liste des modèles de données

Une fois lancée, l'interface graphique affiche tous les modèles de données.

![Hapify GUI - Models edition](../../assets/gui-models.jpg 'Models Edition')

!!! tip "Astuce"
    Pour les projets avec beaucoup de modèles de données, vous pouvez filtrer ceux-ci par nom, nom de champ ou référence. Utilisez la barre supérieure droite.
    Appuyez sur la touche d'échappement pour réinitialiser les filtres.

## Ajouter et modifier des modèles de données

Cliquez sur le bouton `New model`, entrez un nom et appuyez sur la touche "Entrée".

Le nouveau modèle de données sera rempli avec les champs par défaut.
Les champs par défaut sont définis dans le fichier de configuration du boilerplate (`hapify.json`).

!!! tip "Astuce"
    Une fois créé, vous pouvez modifier le nom du modèle de données en cliquant sur celui-ci.

### Importer des modèles de données prédéfinis

Cliquez sur le bouton `Import collections`, choisissez une collection et validez.

![Hapify GUI - Models import](../../assets/gui-models-import-collections.jpg 'Models import')

Les modèles de données de la collection seront fusionnés avec les modèles de données existants en cas de conflit.

### Supprimer, cloner et copier

Cliquez sur les trois points pour afficher ce menu :

![Hapify GUI - More options](../../assets/gui-models-more-options.jpg 'More options'){: style="width: 142px"}

#### Copier-coller

Lorsque vous copiez un modèle de données, il est ajouté en tant que JSON dans votre presse-papiers.
Pour coller un modèle de données, cliquez sur `Paste from clipboard` à la fin de la liste des modèles de données.

Ceci est utile pour copier-coller des modèles de données entre plusieurs projets.

## Ajouter et modifier des champs

Cliquez sur `Add field` à la fin d'un modèle de données et entrez un nom.

Vous pouvez choisir son type et son sous-type :

![Hapify GUI - Field type](../../assets/gui-models-fields-types.jpg 'Field type'){: style="width: 416px"}

Et aussi ses attributs en cliquant sur l'engrenage :

![Hapify GUI - Field attributes](../../assets/gui-models-fields-attributes.jpg 'Field attributes'){: style="width: 420px"}

!!! tip "Astuce"
    Une fois créé, vous pouvez modifier le nom du champ en cliquant dessus.

!!! seealso "Voir aussi"
    Pour en savoir plus sur la gestion des champs, veuillez vous référer à la description [du modèle de données](../../concepts/models/#model-properties).

### Supprimer un champ

Cliquez sur l'icône "poubelle" et sélectionnez les champs à supprimer :

![Hapify GUI - Delete fields](../../assets/gui-models-fields-delete.jpg 'Delete fields'){: style="width: 374px"}

## Modifier les accès au modèle de données  

Développez le panneau de gestion des accès en cliquant sur l'icône "empreinte digitale" en haut d'un modèle :

![Hapify GUI - Access management](../../assets/gui-models-access-managment.jpg 'Access management'){: style="width: 410px"}

!!! seealso "Voir aussi"
    Pour en savoir plus sur la gestion des accès, veuillez vous référer à la description [du modèle de données](../../concepts/models/#access-management).
    
## Ajouter des notes

Vous pouvez laisser des notes sur les modèles de données et leurs champs. Cliquez sur l'icône "bulle" et écrivez une note.

**Sur un modèle:**

![Hapify GUI - Models notes](../../assets/gui-models-notes.jpg 'Models notes'){: style="width: 381px"}

**Sur un champ:**

![Hapify GUI - Models notes](../../assets/gui-models-fields-notes.jpg 'Models notes'){: style="width: 411px"}

## Erreurs et avertissements

Un boilerplate peut valider les modèles de données que vous écrivez.
Ces erreurs ou avertissements apparaîtront lors de la modification des modèles de données.

![Hapify GUI - Models error](../../assets/gui-models-error.jpg 'Models error'){: style="width: 464px"}
