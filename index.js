const Client = require('./client');

(async function main () {
    const c = new Client('127.0.0.1', 8007);
    c.setDatabaseCredentials('root', 'root');
    c.setNamespaceCredentials('main', 'user', 'user');

    console.log( await c.listNamespaceUsers('main') );
})();