## Exécutez la commande `serve`.

À ce stade, vous avez un channel vide et aucun modèle de données dans votre projet.
Afin de créer un nouveau template, vous devez d'abord créer quelques modèles de données.

Exécutez [cette commande](../../reference/cli.md#serve) :

```bash
hpf serve
```

### Ajouter des modèles de données

Créez ou importez des modèles de données pour votre projet.
Cette étape est obligatoire pour l'étape suivante afin de valider que vos templates fonctionnent.

Nous vous recommandons d'ajouter les modèles de données qui couvriront les cas d'utilisation que vous souhaitez traiter.

Par exemple, si vous prévoyez de traiter la `latitude` et la `longitude` dans vos templates, ajoutez alors au moins un modèle de données qui comporte ces champs.

Un autre cas fréquent est celui des relations entre les modèles de données.
Nous vous recommandons d'ajouter plusieurs relations entre vos modèles de données, même une relation d'auto-référence.

!!! seealso "Voir aussi"
    Pour en savoir plus sur la gestion des modèles de données, veuillez vous référer à [édition des modèles de données](../existing-boilerplate/step-2-edit-models.md).

## Champs par défaut

Vous pouvez définir des champs par défaut qui seront ajoutés à tout nouveau modèle de données.
Ces champs ne sont pas contraignants, l'utilisateur pourra les modifier ou les supprimer s'il le souhaite.
Ceci est utile pour définir la clé primaire de vos modèles de données par exemple.

Les champs par défaut sont définis dans le fichier `hapify.json`:

```json
{
  "defaultFields": [
    {
      "name": "Id",
      "type": "string",
      "properties": ["primary", "internal"]
    }
  ]
}
```

Pour obtenir ces champs par défaut, vous pouvez créer un modèle de données qui ne contient que les champs par défaut voulus.
Ouvrez ensuite le fichier `hapify-models.json`, et copiez les champs du modèle de données en question:

```json
{
  "fields": [
    {
      "name": "id",
      "type": "number",
      "properties": ["primary", "internal"]
    }
  ]
}
```

Enfin, collez cela dans le fichier `hapify.json` à l'entrée `defaultFields`.

!!! warning "Attention"
    Les modifications du fichier `hapify.json` ne sont pas prises en compte à la volée. Vous devez relancer la commande `hpf serve`.
