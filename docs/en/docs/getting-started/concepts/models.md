## Modeling approach

The model definition in Hapify is **agnostic** and **featured-oriented** (behavioral), which means Hapify defines what the model **should do**, not **how it will do it**.

## <a name="access"></a>Access management

Hapify supports the 6 following base operations:

- _Create_
- _Read_
- _Update_
- _Delete_
- _Search_
- _Count_

For each of these actions, Hapify allows you to define the following access restrictions:

- _Guest_: user who is not logged-in.
- _Authenticated_: logged-in user.
- _Owner_ : logged-in user who owns the entity (see [Field attributes](#fields) for more details).
- _Admin_: logged-in super-admin user.

Accesses are inclusive, which means the _Authenticated_ restriction necessarily includes _Owner_ and _Admin_.

_Guest_ is the most permissive and _Admin_ the least permissive. Therefore `Admin < Owner < Authenticated < Guest`.

## <a name="fields"></a>Fields

A model contains a list of fields. Each field is defined by:

- a name
- a type
- a subtype (optional)
- a set of (behavioral) attributes.

### Types and subtypes

Available types ans subtypes are:

- `string`
	- `email`, `password`, `url`, `text`, `rich`
- `number`
	- `integer`, `float`, `latitude`, `longitude`
- `boolean`
- `datetime`
	- `date`, `time`
- `enum`
- `entity` (reference to another model)
	- `oneOne`, `oneMany`, `manyOne`, `manyMany`
- `object`
- `file`
	- `image`, `video`, `audio`, `document`

### Field attributes

- **Primary**: the field is the primary identifier.

- **Unique**: the field contains unique values, required to avoid duplicates. A model could have multiple unique keys. (e.g.: user's email or coupon code).

- **Label**: the field is a human readable identifier. (e.g.: user's first name and last name, a movie title).

- **Nullable**: the field can contain empty value. In other words, it is not required.

- **Multiple**: this field will contain not a single value but a list of value or references.

- **Embedded**: ability to automatically attach data from a linked entity. (e.g.: When you get a user's details, you may want to get their avatar at the same time). This can be used to embed forms as well.

- **Searchable**: ability to search for entities based on this field.

- **Sortable**: ability to sort search results based on this field.

- **Hidden**: this field should never be sent to the end-user. (e.g.: user's password).
	
- **Internal**: a value defined internally by the system, which the end-user cannot set (e.g.: entity creation date, primary key, etc.).
	
- **Restricted**: if data access (read and/or write) is restricted to specific users (e.g.: a `validated` status to be set by an admin only).

- **Ownership**: defines the identity of the entity owner(s) (e.g.: a bar with a field `creator` containing the user ID).

!!! seealso "See also"
    For the complete structure of the data models, you can refer to this [documentation](../../reference/model-object.md).
