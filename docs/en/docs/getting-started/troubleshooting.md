# Troubleshooting

While using the Hapify CLI/GUI, you may encounter some errors during code generation, template or model edition and project management.

This guide will list all known errors to help you resolve them.

If you find an unknown error, please contact us: [hapify.io/contact](https://www.hapify.io/contact).

## Errors sent by the Hapify syntax

Errors range: 1000 to 1999

-   1001 (SyntaxInternalError): Thrown when an unexpected error is triggered.
-   1002 (SyntaxArgumentsError): Thrown when the "run" function is called with wrong arguments.
-   1003 (SyntaxParsingError): Thrown when the Hpf template has a syntax error.
-   1004 (SyntaxEvaluationError): Thrown when the evaluation of the Hpf template causes an error.
-   1005 (SyntaxTimeoutError): Thrown when the Hpf template is too long to process.

## Errors sent by the Hapify Generator

Errors range: 2000 to 2999

-   2001 (GeneratorInternalError): Thrown when an unexpected error is triggered.
-   2002 (GeneratorRequestError): Thrown when routes are called with wrong arguments.
-   2003 (GeneratorRouteError): Thrown when an error occurs during routes processing (status >= 401).
-   2004 (GeneratorEvaluationError): Thrown when the evaluation of the JS template causes an error.
-   2005 (GeneratorTimeoutError): Thrown when the JS template is too long to process.

## Errors sent by the Hapify API

Errors range: 3000 to 3999

### Generic errors

-   3001 (ApiInternalError): Thrown when an unexpected error is triggered.
-   3002 (ApiError): Thrown when a route emits an error that cannot be specified.
-   3003 (ApiRequestError): Thrown when a route are called with wrong arguments.
-   3010 (ApiAuthenticationError): Thrown when there was an issue with the authentication.
-   3020 (ApiPlanError): Thrown when the resource reached a limit of the current plan.
-   3030 (ApiForbiddenError): Thrown when the access to the resource is forbidden.
-   3040 (ApiNotFoundError): Thrown when the resource is not found.
-   3090 (ApiDuplicateError): Thrown when the resource already exists.
-   3220 (ApiDataError): Thrown when the data to process is malformed.
-   3290 (ApiRateError): Thrown when too many requests have been done.

### Generator errors

-   3021 (ApiGeneratorPlanError): Thrown when a limit about models, fields or templates has been reached.
-   3031 (ApiGeneratorForbiddenError): Thrown when the access to a project or model is forbidden.
-   3041 (ApiGeneratorNotFoundError): Thrown when a project or model does not exist.
-   3221 (ApiGeneratorDataError): Thrown when there is no model attached to this project.
-   3291 (ApiGeneratorRateError): Thrown when too many requests have been done to the generator.

### Model errors

-   3032 (ApiModelForbiddenError): Thrown when the access to the model is forbidden.
-   3042 (ApiModelNotFoundError): Thrown when the project or model does not exist.

### Project errors

-   3023 (ApiProjectPlanError): Thrown when the user already reached their project limit.
-   3033 (ApiProjectForbiddenError): Thrown when the access to the project is forbidden.
-   3043 (ApiProjectNotFoundError): Thrown when the project does not exist.

## Errors sent by the Hapify CLI

Errors range: 4000 to 4999

-   4001 (CliInternalError): Thrown when an unexpected error is triggered.
-   4002 (CliMessageValidationError): Thrown when an incoming message from web console is malformed.
-   4003 (CliDataValidationError): Thrown when data sent by the web console is malformed.
-   4004 (CliUnknownMessageError): Thrown when the incoming message ID is unknown.
-   4005 (CliValidatorEvaluationError): Thrown when the evaluation of the JS validator causes an error.
-   4006 (CliValidatorTimeoutError): Thrown when the JS validator is too long to process.
-   4007 (CliValidatorOutputError): Thrown when the JS validator returns malformed data.

## Errors sent by the Hapify GUI

Errors range: 5000 to 5999

-   5001 (ConsoleInternalError): Thrown when an unexpected error is triggered.
-   5002 (ConsoleWebSocketError): Thrown when an error occurred with WebSocket client.
-   5003 (ConsoleWebSocketTimeoutError): Thrown when a timeout is triggered when calling WebSocket server.
-   5004 (ConsoleWebSocketFetchError): Thrown when unable to fetch connection information for WebSocket server.
-   5005 (ConsoleWebSocketConnectionError): Thrown when connection to WebSocket server is lost.
-   5006 (ConsoleWebSocketResponseError): Thrown when an unknown error is returned by the WebSocket client.

## Errors sent by the Hapify VM

Errors range: 6000 to 6999

-   6001 (VmOutputError): Thrown when the script does not return a string or undefined.
-   6002 (VmEvaluationError): Thrown when the evaluation of the JS script causes an error.
-   6003 (VmTimeoutError): Thrown when the JS script is too long to process.
-   6004 (VmIntegrityError): Thrown when the script throws a modified error.
