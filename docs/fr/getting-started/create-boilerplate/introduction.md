## Résumé

Dans cette section, vous apprendrez comment créer votre propre boilerplate avec Hapify.

Vous pouvez démarrer un boilerplate à partir de zéro ou utiliser un boilerplate existant.

Cette section se concentre sur l'écriture de templates de code.
Comme Hapify est un moteur agnostique et n'est pas limité à un cadre spécifique, nous ne nous concentrerons pas sur la structure du boilerplate lui-même.
Nous étudierons des exemples de templates courants.

## Moteurs de templates

Hapify propose trois moteur de templates.
Un boilerplate peut utiliser plusieurs moteurs simultanément.

Ces moteurs ont accès à l'[objet modèle](../../model-object/).
Cet objet, injecté dans les templates, explicite le modèle de données ainsi que toutes ses propriétés et relations, de sorte qu'elles soient facilement accessibles depuis le template.

### Moteur de template Hapify

Cette syntaxe est optimisée pour jouer avec le [objet modèle](../../model-object/) et ses propriétés en utilisant des mots courts.
Cela vous permet de gérer des idées complexes avec des phrases courtes.

Cette syntaxe a deux variantes :

- **long** : facile à lire
- **short** : basé sur des abréviations
 
Les deux variantes peuvent être utilisées dans le même template.

#### Exemple

Par exemple, cette boucle en Javascript :

```javascript
for (let f of model.fields.list.filter(f => f.searchable && f.type === 'entity')) {
	out += 'Field name: ' + f.names.camel;
}
```

Sera écrite comme ceci avec la syntaxe Hapify :

=== "Syntaxe longue"

    ```hapify
    <<for Fields searchable and entity f>>
        Field name: <<f camel>>
    <<endfor>>
    ```

=== "Syntaxe courte"

    ```hapify
    <<@ F se*tE f>>
        Field name: <<f aA>>
    <<@>>
    ```

!!! success "Pour"
    - Un méta-code facile à lire
    - Un méta-code plus court, rendant le code cible lisible
    - Encore plus court avec la variante courte

!!! failure "Contre"
    - Une autre syntaxe à apprendre, bien qu'elle soit simple
    - La syntaxe peut ne pas traiter certaines conditions spécifiques

### Moteur EJS

Vous pouvez utiliser EJS comme moteur de template.
Toutes les fonctionnalités d'EJS sont disponibles, sauf la fonctionnalité `include`.
Cette fonction est volontairement désactivée afin que les templates n'aient pas accès à votre système de fichiers.

#### Exemple

Par exemple, cette boucle en Javascript :

```javascript
for (let f of model.fields.list.filter(f => f.searchable) {
	out += 'Field name: ' + f.names.camel;
}
```

Sera écrite comme ceci avec EJS :

```js
<% for (let f of model.fields.list.filter(f => f.searchable) { %>
	Field name: <%= f.names.camel %>
<% } %>
```

!!! success "Pour"
    - Un moteur de template connu
    - Gère bien les conditions complexes et l'interpolation
    - Plus de flexibilité

!!! failure "Contre"
    - Méta-code long, rendant le code cible moins lisible

### Moteur JavaScript

Vous pouvez écrire des templates en JavaScript pure.

Ce moteur est très utile pour générer des fichiers JSON. 

#### Exemple

```javascript
const output = models.map((model) => model.names.snake);
return JSON.stringify(output, null, 2);
```

```javascript
const property = (field) => `private ${field.names.camel};`;
return `class ${model.names.pascal} {
    ${model.fields.list.map(property).join('\n    ')}
}`;
```

!!! success "Pour"
    - Puissant lors de la génération de fichiers de configuration tels que JSON
    - Très flexible

!!! failure "Contre"
    - Difficile de différencier le méta-code du code cible.
