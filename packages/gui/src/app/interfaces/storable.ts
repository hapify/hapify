export interface IStorableBase {
	/** The object's unique id */
	id: string;
}

export interface IStorable extends IStorableBase {
	/** Convert the instance to an object */
	toObject(): IStorableBase;

	/** Bind properties from the base object to this object */
	fromObject(object: IStorableBase): void;
}
