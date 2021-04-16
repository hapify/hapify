'use strict';

/**
 * Create bookmark.
 * Returns the created bookmark.
 */

const Joi = require('joi');
const Boom = require('boom');
const MongoDB = require('mongodb');

// Validation schema for payload
const schemaObjectPublic = {
	place: Joi.string().length(24).hex().required(),
};
const schemaObjectAdmin = Object.assign(
	{
		owner: Joi.string().length(24).hex().required(),
	},
	schemaObjectPublic
);

/**
 * Define handler
 */
const handler = async (request, h) => {
	// Get bookmark from payload
	const payload = request.payload;

	// Init internal fields
	payload.created_at = Date.now();

	// Convert reference fields
	// Relationship: default
	payload.owner = typeof request.payload.owner === 'string' ? new MongoDB.ObjectId(request.payload.owner) : request.auth.credentials._id;
	// Relationship: one-to-one
	payload.place = typeof request.payload.place === 'string' ? new MongoDB.ObjectId(request.payload.place) : null;

	// @hook create:before-insert:bookmark

	// Insertion options
	const options = { w: 'majority' };

	// Insert bookmark into database
	const result = await request.server.db.collection('bookmark').insertOne(payload, options);

	if (result.insertedCount === 0) {
		return Boom.internal('Insert error');
	}

	const bookmark = result.ops[0];

	// @hook create:after-insert:bookmark

	return h.response(bookmark).code(201);
};

/**
 * Export route to create bookmark
 */
module.exports = [
	{
		method: 'POST',
		path: '/admin/bookmark',
		config: {
			validate: { payload: Joi.object(schemaObjectAdmin) },
			description: 'Route to create bookmark as admin',
			tags: ['admin', 'bookmark', 'create'],
			auth: {
				strategy: 'session',
				scope: 'role-admin',
			},
		},
		handler,
	},
	{
		method: 'POST',
		path: '/bookmark',
		config: {
			validate: { payload: Joi.object(schemaObjectPublic) },
			description: 'Route to create bookmark',
			tags: ['bookmark', 'create'],
			auth: {
				strategy: 'session',
				scope: 'role-user',
			},
		},
		handler,
	},
];
