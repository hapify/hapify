## Exécutez la commande `serve`.

À ce stade, vous avez un channel vide et aucun modèle de données dans votre projet.
Afin de créer un nouveau template, vous devez d'abord créer quelques modèles de données.

Exécutez [cette commande](../../reference/cli.md#serve) :

```bash
hpf serve
```

### Ajouter des modèles de données

Créez ou importez des templates pour votre projet.
Cette étape est obligatoire pour l'étape suivante afin de valider que vos templates fonctionnent.

Nous vous recommandons d'ajouter les templates qui couvriront les cas d'utilisation que vous souhaitez traiter.

Par exemple, si vous prévoyez de traiter la `latitude` et la `longitude` dans vos templates, ajoutez alors au moins un modèle de données qui comporte ces champs.

Un autre cas fréquent est celui des relations entre les modèles de données.
Nous vous recommandons d'ajouter plusieurs relations entre vos modèles de données, même une relation d'auto-référence.

!!! seealso "Voir aussi"
    Pour en savoir plus sur la gestion des modèles de données, veuillez vous référer à [édition des modèles de données](../existing-boilerplate/step-2-edit-models.md).
