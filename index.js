const Client = require('./src/client');
module.exports = Client;


// Usage Example:
// (async function main () {
//     const c = new Client('localhost', 8000);
//     c.setDatabaseCredentials('root', 'root');
//     c.setNamespaceCredentials('main', 'user', 'user');
//     console.log( await c.listNamespaceUsers('main') );
// })();