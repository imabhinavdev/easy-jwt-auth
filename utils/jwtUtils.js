// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import crypto from 'crypto';

// Set up random fallback for bcryptjs
bcrypt.setRandomFallback((len) => {
    const buf = crypto.randomBytes(len);
    return buf;
});



export const addJWTMethodsToSchema = (schema, secret, uniqueKey = 'email', password = 'password') => {
    // Add unique key and password fields if they are not already in the schema
    if (!schema.path(uniqueKey)) {
        schema.add({ [uniqueKey]: { type: String, required: true, unique: true } });
    }

    if (!schema.path(password)) {
        schema.add({ [password]: { type: String, required: true, select: false } });
    } if (schema.path(password)) {
        schema.path(password).options.select = false;
    }
    // Add password hashing middleware
    schema.pre('save', async function (next) {
        if (!this.isModified(password)) return next();


        if (typeof this[password] !== 'string') {
            return next(new Error('Password must be a string'));
        }

        try {
            let salt = bcrypt.genSaltSync(10);

            this[password] = await bcrypt.hash(this[password], salt);
            console.log('Password after hashing:', this[password]); // Debug log
            next();
        } catch (error) {
            return next(error);
        }
    });

    // Add methods to schema
    schema.methods.matchPassword = async function (enteredPassword) {
        if (typeof enteredPassword !== 'string') {
            throw new Error('Entered password must be a string');
        }
        return bcrypt.compare(enteredPassword, this[password]);
    };

    schema.methods.generateToken = function (secret, expiresIn = '1h') {
        const user = this.toObject();
        delete user[password]; // Remove password field
        return jwt.sign(user, secret, { expiresIn });
    };

    schema.methods.generateRefreshToken = function (secret, expiresIn = '7d') {
        return jwt.sign({ id: this._id }, secret, { expiresIn });
    };


    return schema;
};
