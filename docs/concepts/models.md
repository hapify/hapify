# Models

## Modeling approach

Hapify lets you define the data-models that fit your project specifications.

The model definition in Hapify is **agnostic** and **featured-oriented** (behavioral), which means Hapify defines what the model **should do**, not **how it will do it**.

## Access management

In order to remove the need to write repeating boilerplates for extended CRUD operations, Hapify supports the 6 following base operations:

-   _Create_
-   _Read_
-   _Update_
-   _Delete_
-   _Search_
-   _Count_

For each of these actions, Hapify allows you to define the following access restrictions:

-   _Guest_: user who is not logged-in.
-   _Authenticated_: logged-in user.
-   _Owner_ : logged-in user who owns the entity (see [Field properties](#field-properties) for more details).
-   _Admin_: logged-in super-admin user.

Accesses are inclusive, which means the _Authenticated_ restriction necessarily includes _Owner_ and _Admin_.

## Model properties

A model contains a list of fields. Each field is defined by:

- a name
- a type
- a sub-type (optional)
- a set of (behavioral) properties.

### Types and sub-types

Available types are:

- `string`
	- `email`
	- `password`
	- `url`
	- `text`
	- `rich`
 
- `number`
	- `integer`
	- `float`
	- `latitude`
	- `longitude`

- `boolean`

- `datetime`
	- `date`
	- `time`

- `enum`

- `entity` (reference to another model)
	- `oneOne`
	- `oneMany`
	- `manyMany`

- `object`

- `file`
	- `image`
	- `video`
	- `audio`
	- `document`

### Field properties

- **Primary**: the field is the primary identifier.

- **Unique**: the field contains unique values, required to avoid duplicates. A model could have multiple unique keys. (e.g.: user's email or coupon code).

- **Label**: the field is a human readable identifier. (e.g.: user `First Name` and `Last Name`, a movie title).

- **Nullable**: the field can contain empty value. In other words, it is not required.

- **Multiple**: this field will contain not a single value but a list of value or references.

- **Embedded**: ability to automatically attach data from a linked entity. (e.g.: When you get a user's details, you may want to get their avatar at the same time). This can be used to embed forms as well.

- **Searchable**: ability to search for entities based on this field.

- **Sortable**: ability to sort search results based on this field.

- **Hidden**: this field should never be sent to the end-user. (e.g.: user's password).
	
- **Internal**: a value defined internally by the system, which the end-user cannot set (e.g.: entity creation date, primary key, etc.).
	
- **Restricted**: if data access (read and/or write) is restricted to specific users (e.g.: a `validated` status to be set by an admin only).

- **Ownership**: defines the identity of the entity owner(s) (e.g.: a bar with a field `creator` containing the user ID).
