## Exécuter la commande `generate`

Lorsque vos modèles de données seront prêts, générez le code avec [cette commande](../../reference/cli.md#generate) :

```bash
hpf generate
```

Ceci lancera le générateur et copiera les fichiers générés dans votre boilerplate localement :

```
• Found channel HapiJS in ~/my-project/boilerplate-hapijs
• Found channel Angular Dashboard in ~/my-project/boilerplate-ngx-dashboard
✓ Generated 60 files for channel HapiJS
✓ Generated 189 files for channel Angular Dashboard
```

Vous pouvez maintenant commencer à personnaliser et à utiliser le code généré.

!!! tip "À savoir"
    La commande `generate` peut gérer plusieurs [boilerplates ou channels](../concepts/terminology.md) à la fois.
    Pour en savoir plus sur la commande `generate`, veuillez vous référer à [cet article](../../reference/cli.md#generate).

## Formater le code

Hapify ne formate pas le code de sortie. Cette tâche est déléguée au boilerplate lui-même.
Nous vous recommandons vivement d'utiliser le linter intégré au boilerplate, le cas échéant, ou d'utiliser le formateur de code de votre IDE.

