Lors de l'utilisation du CLI/GUI Hapify, vous pouvez rencontrer certaines erreurs lors de la génération du code, de l'édition des templates ou des modèles et de la gestion des projets.

Ce guide énumère toutes les erreurs connues afin de vous aider à les résoudre.

Si vous trouvez une erreur inconnue, veuillez nous contacter : [hapify.io/contact](https://www.hapify.io/contact).

## Erreurs envoyées par la syntaxe Hapify

Plage d'erreurs : 1000 à 1999

- 1001 (SyntaxInternalError) : Émise lorsqu'une erreur inattendue est déclenchée.
- 1002 (SyntaxArgumentsError) : Émise lorsque la fonction "run" est appelée avec des arguments erronés.
- 1003 (SyntaxParsingError) : Émise lorsque le template Hpf comporte une erreur de syntaxe.
- 1004 (SyntaxEvaluationError) : Émise lorsque l'évaluation du template Hpf provoque une erreur.
- 1005 (SyntaxTimeoutError) : Émise lorsque le template Hpf est trop long à traiter.

## Erreurs envoyées par le générateur Hapify

Fourchette d'erreurs : 2000 à 2999

- 2001 (GeneratorInternalError) : Émise lorsqu'une erreur inattendue est déclenchée.
- 2002 (GeneratorRequestError) : Émise lorsque les routes sont appelés avec des arguments erronés.
- 2003 (GeneratorRouteError) : Émise lorsqu'une erreur se produit pendant le traitement d'une requête (statut >= 401).
- 2004 (GeneratorEvaluationError) : Émise lorsque l'évaluation du template JS provoque une erreur.
- 2005 (GeneratorTimeoutError) : Émise lorsque le template JS est trop long à traiter.

## Erreurs envoyées par l'API Hapify

Plage d'erreurs : 3000 à 3999

### Erreurs génériques

- 3001 (ApiInternalError) : Émise lorsqu'une erreur inattendue est déclenchée.
- 3002 (ApiError) : Émise lorsqu'une route déclenche une erreur qui ne peut être spécifiée.
- 3003 (ApiRequestError) : Émise lorsqu'une route est appelé avec des arguments erronés.
- 3010 (ApiAuthenticationError) : Émise lorsqu'il y a eu un problème d'authentification.
- 3020 (ApiPlanError) : Émise lorsque la ressource a atteint la limite de l'abonnement.
- 3030 (ApiForbiddenError) : Émise lorsque l'accès à la ressource est interdit.
- 3040 (ApiNotFoundError) : Émise lorsque la ressource n'est pas trouvée.
- 3090 (ApiDuplicateError) : Émise lorsque la ressource existe déjà.
- 3220 (ApiDataError) : Émise lorsque les données à traiter sont malformées.
- 3290 (ApiRateError) : Émise lorsque trop de requêtes ont été effectuées.

### Erreurs du générateur

- 3021 (ApiGeneratorPlanError) : Émise lorsqu'une limite sur les modèles, les champs ou les templates est atteinte.
- 3031 (ApiGeneratorForbiddenError) : Émise lorsque l'accès à un projet ou à un modèle est interdit.
- 3041 (ApiGeneratorNotFoundError) : Émise lorsqu'un projet ou un modèle n'existe pas.
- 3221 (ApiGeneratorDataError) : Émise lorsqu'il n'y a pas de modèle attaché à ce projet.
- 3291 (ApiGeneratorRateError) : Émise lorsque trop de demandes ont été faites au générateur.

### Erreurs de modèle

- 3032 (ApiModelForbiddenError) : Émise lorsque l'accès au modèle est interdit.
- 3042 (ApiModelNotFoundError) : Émise lorsque le projet ou le modèle n'existe pas.

### Erreurs de projet

- 3023 (ApiProjectPlanError) : Émise lorsque l'utilisateur a déjà atteint la limite de son projet.
- 3033 (ApiProjectForbiddenError) : Émise lorsque l'accès au projet est interdit.
- 3043 (ApiProjectNotFoundError) : Émise lorsque le projet n'existe pas.

## Erreurs envoyées par le CLI Hapify

Plage d'erreurs : 4000 à 4999

- 4001 (CliInternalError) : Émise lorsqu'une erreur inattendue est déclenchée.
- 4002 (CliMessageValidationError) : Émise lorsqu'un message entrant provenant de la console web est malformé.
- 4003 (CliDataValidationError) : Émise lorsque les données envoyées par la console web sont malformées.
- 4004 (CliUnknownMessageError) : Émise lorsque l'ID du message entrant est inconnu.
- 4005 (CliValidatorEvaluationError) : Émise lorsque l'évaluation du validateur JS provoque une erreur.
- 4006 (CliValidatorTimeoutError) : Émise lorsque le validateur JS est trop long à traiter.
- 4007 (CliValidatorOutputError) : Émise lorsque le validateur JS renvoie des données malformées.

## Erreurs envoyées par l'interface graphique de Hapify

Plage d'erreurs : 5000 à 5999

- 5001 (ConsoleInternalError) : Émise lorsqu'une erreur inattendue est déclenchée.
- 5002 (ConsoleWebSocketError) : Émise lorsqu'une erreur est survenue avec le client WebSocket.
- 5003 (ConsoleWebSocketTimeoutError) : Émise lorsqu'un délai d'attente est déclenché lors d'un appel au serveur WebSocket.
- 5004 (ConsoleWebSocketFetchError) : Émise lorsqu'il est impossible d'obtenir des informations de connexion pour le serveur WebSocket.
- 5005 (ConsoleWebSocketConnectionError) : Émise lorsque la connexion au serveur WebSocket est perdue.
- 5006 (ConsoleWebSocketResponseError) : Émise lorsqu'une erreur inconnue est renvoyée par le client WebSocket.

## Erreurs envoyées par la VM Hapify

Plage d'erreurs : 6000 à 6999

- 6001 (VmOutputError) : Émise lorsque le script ne renvoie pas de chaîne de caractères ou est indéfini.
- 6002 (VmEvaluationError) : Émise lorsque l'évaluation du script JS provoque une erreur.
- 6003 (VmTimeoutError) : Émise lorsque le script JS est trop long à traiter.
- 6004 (VmIntegrityError) : Émise lorsque le script lance une erreur modifiée.

## Erreurs envoyées par le générateur EJS

Plage d'erreurs : 7000 à 7999

- 7001 (EjsEvaluationError) : Émise lorsque l'évaluation du template EJS provoque une erreur.
