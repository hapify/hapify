/**
 * Possible values for actions' access:
 *  - admin (Denotes if the access is restricted to the admins)
 *  - owner (Denotes if the access is restricted to the owner of the resource)
 *  - authenticated (Denotes if the access is restricted to authenticated users)
 *  - guest (Denotes if the access is not restricted)
 */
export class Access {
	static GUEST = 'guest';
	static AUTHENTICATED = 'auth';
	static OWNER = 'owner';
	static ADMIN = 'admin';
}

export interface IAccesses {
	create: string;
	read: string;
	update: string;
	remove: string;
	search: string;
	count: string;
}
