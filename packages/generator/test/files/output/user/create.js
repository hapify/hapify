'use strict';

/**
 * Create user.
 * Returns the created user.
 * This model has enum:
 * - role: super_admin admin user visitor
 */

const Joi = require('joi');
const Boom = require('boom');

// Validation schema for payload
const schemaObjectPublic = {
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(6).trim().required(),
    birthdate: Joi.number().required(),
};
const schemaObjectAdmin = Object.assign({
    role: Joi.string().trim().valid(['super_admin', 'admin', 'user', 'visitor']).required(),
    banned: Joi.boolean().required(),
    premium_forced: Joi.boolean().required(),
}, schemaObjectPublic);

/**
 * Define handler
 */
const handler = async (request, h) => {

    // Get user from payload
    const payload = request.payload;

    // Init internal fields
    payload.created_at = Date.now();
    payload.last_connected_at = Date.now();
    payload.last_connection_ip = '';
    payload.email_confirmed = false;
    payload.email_confirmation_code = '';
    payload.password_reset_code = '';
    payload.premium = false;

    // Init restricted fields
    payload.role = typeof request.payload.role !== 'undefined' ?
        request.payload.role : 'user';
    payload.banned = typeof request.payload.banned !== 'undefined' ?
        request.payload.banned : false;
    payload.premium_forced = typeof request.payload.premium_forced !== 'undefined' ?
        request.payload.premium_forced : false;

    // Hash password
    if (typeof payload.password !== 'undefined') {
        payload.password = request.server.utils.Hash.bcrypt(payload.password);
    }

    // @hook create:before-insert:user

    // Insertion options
    const options = { w: 'majority' };

    // Insert user into database
    let result;
    try {
        result = await request.server.db.collection('user')
            .insertOne(payload, options);
    }
    catch (e) {
        // Handle duplicated key for unique indexes
        return e.name === 'MongoError' && e.code === 11000 ?
            Boom.conflict('Duplicate key') :
            Boom.boomify(e);
    }

    if (result.insertedCount === 0) {
        return Boom.internal('Insert error');
    }

    const user = result.ops[0];

    // @hook create:after-insert:user

    // Delete hidden properties
    delete user.password;
    delete user.last_connection_ip;
    delete user.email_confirmation_code;
    delete user.password_reset_code;

    return h.response(user).code(201);
};

/**
 * Export route to create user
 */
module.exports = [
    {
        method: 'POST',
        path: '/admin/user',
        config: {
            validate: { payload: Joi.object(schemaObjectAdmin) },
            description: 'Route to create user as admin',
            tags: ['admin', 'user', 'create'],
            auth: {
                strategy: 'session',
                scope: 'role-admin'
            }
        },
        handler
    },
    {
        method: 'POST',
        path: '/user',
        config: {
            validate: { payload: Joi.object(schemaObjectPublic) },
            description: 'Route to create user',
            tags: ['user', 'create'],
        },
        handler
    }
];

