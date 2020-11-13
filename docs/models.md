# Data models

## Modeling approach

Hapify let you define the data-models that fit your project specifications.

The model definition in Hapify is **agnostic** and **featured-oriented** (behavioral), which means Hapify defines what the model **should do**, not **how it will do it**.

## Actions & access management

In order to removes the need to write repeating boilerplate for extended CRUD operations,  Hapify supports the 6 following base operations:

-   _Create_
-   _Read_
-   _Update_
-   _Delete_
-   _Search_
-   _Count_

For each of these actions, Hapify allow you to define the following access restrictions:

-   _Guest_: user that is not logged-in.
-   _Authenticated_: logged-in user.
-   _Owner_ : logged-in user which owns the entity (see *Fields properties* for more details).
-   _Admin_: logged-in super-admin user.

Accesses are inclusive, which means the _Authenticated_ restriction necessarily includes _Owner_ and _Admin_.

## Models properties

A model contains a list of fields. Each of this field is defined by
- a name
- a type
- a sub-type (optional)
- a set of (behavioral) properties.

### Type and sub-types

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

- `entity` (reference to another model)

- `object`

- `file`
	- `image`
	- `video`
	- `audio`
	- `document`

### Fields properties

- **Primary** : the fields is the primary identifier.

- **Unique** : the field contains unique values requires to avoid duplicates. A model could have multiple unique keys. (Ex: user's email or coupon code).

- **Label** : the fields is a human readable identifier. (Ex: user `First Name` and `Last Name`, a movie title).

- **Nullable** : the field can contains empty value. In other words, it is not required.

- **Multiple** : This field will contain not a single value but a list of value or references

- **Embedded** : ability to automatically "join" data from a linked entity. (Ex: When you get a user's details, you may want to get his avatar at the same time). 

- **Searchable** : ability to search for entities based on this field.

- **Sortable** : ability to sort search results based on this field.

- **Hidden** : this field should never be sent to the end-user. (Ex: user's password).
	
- **Internal** : a value defined internally by the system, which the end-user cannot set. (Ex: entity creation date, primary key etc.).
	
- **Restricted** : if data access (read and/or write) is restricted to specific users. (Ex: a `validated` status to be set by an admin only).

- **Ownership** : defines the identity of the entity's owner(s). (Ex: a bar with a field `creator` containing the user id).
