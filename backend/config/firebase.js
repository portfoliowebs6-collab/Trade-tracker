const admin = require('firebase-admin');
// Yahan tum apni Firebase Service Account JSON file ka path ya object doge
// Filhal placeholder setup hai:
// const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        // credential: admin.credential.cert(serviceAccount)
    });
}

module.exports = admin;
