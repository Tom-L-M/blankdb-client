const { get, post } = require('./utils');

class ClientError extends Error {
    constructor (msg) { 
        super(msg); 
    }; 
};

class Client {
    #auth; #connector;

    constructor (address, port, { dbuser, dbpass } = { dbuser: '', dbpass: '' }) {
        this.#connector = `http://${address}:${port}`;
        this.#auth = {
            db: { user: dbuser, pass: dbpass },
            ns: {}
        }
    };

    storedDBCredentials () {
        return this.#auth.db;
    }

    storedNSCredentials (nsname) {
        return this.#auth.ns[nsname];
    }

    setDatabaseCredentials (username, password) {
        if (!username) throw new ClientError('Missing Parameter [0]: <username>');
        if (!password) throw new ClientError('Missing Parameter [1]: <password>');
        this.#auth.db.user = username;
        this.#auth.db.pass = password;
        return this;
    };

    setNamespaceCredentials (nsname, username, password) {
        if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
        if (!username) throw new ClientError('Missing Parameter [1]: <username>');
        if (!password) throw new ClientError('Missing Parameter [2]: <password>');
        this.#auth.ns[nsname] = {
            user: username,
            pass: password
        };
        return this;
    };

    // Using database credentials:

        hello () {
            if (!this.#auth.db.user || !this.#auth.db.pass) throw new ClientError('Missing Database-Level Credentials');
            return get(`${this.#connector}/`, this.#auth.db.user, this.#auth.db.pass);
        };

        createNamespace (nsname) {
            if (!this.#auth.db.user || !this.#auth.db.pass) throw new ClientError('Missing Database-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            return get(`${this.#connector}/nsp/new/${nsname}`, this.#auth.db.user, this.#auth.db.pass);
        };

        removeNamespace (nsname) {
            if (!this.#auth.db.user || !this.#auth.db.pass) throw new ClientError('Missing Database-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            return get(`${this.#connector}/nsp/del/${nsname}`, this.#auth.db.user, this.#auth.db.pass);
        };

        listNamespaces () {
            if (!this.#auth.db.user || !this.#auth.db.pass) throw new ClientError('Missing Database-Level Credentials');
            return get(`${this.#connector}/nsp/all`, this.#auth.db.user, this.#auth.db.pass);
        };

        createDatabaseUser (username, password) {
            if (!this.#auth.db.user || !this.#auth.db.pass) throw new ClientError('Missing Database-Level Credentials');
            if (!username) throw new ClientError('Missing Parameter [0]: <username>');
            if (!password) throw new ClientError('Missing Parameter [1]: <password>');
            return post(`${this.#connector}/dbu/new/${username}`, password, this.#auth.db.user, this.#auth.db.pass);
        };

        removeDatabaseUser (username) {
            if (!this.#auth.db.user || !this.#auth.db.pass) throw new ClientError('Missing Database-Level Credentials');
            if (!username) throw new ClientError('Missing Parameter [0]: <username>');
            return get(`${this.#connector}/dbu/del/${username}`, this.#auth.db.user, this.#auth.db.pass);
        };

        getDatabaseUser (username) {
            if (!this.#auth.db.user || !this.#auth.db.pass) throw new ClientError('Missing Database-Level Credentials');
            if (!username) throw new ClientError('Missing Parameter [0]: <username>');
            return get(`${this.#connector}/dbu/get/${username}`, this.#auth.db.user, this.#auth.db.pass);
        };

        listDatabaseUsers () {
            if (!this.#auth.db.user || !this.#auth.db.pass) throw new ClientError('Missing Database-Level Credentials');
            return get(`${this.#connector}/dbu/all`, this.#auth.db.user, this.#auth.db.pass);
        };
    

    // Using namespace credentials:

        createCollection (nsname, colname) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            if (!colname) throw new ClientError('Missing Parameter [1]: <collection-name>');
            return get(`${this.#connector}/col/new/${nsname}/${colname}`, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        removeCollection (nsname, colname) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            if (!colname) throw new ClientError('Missing Parameter [1]: <collection-name>');
            return get(`${this.#connector}/col/del/${nsname}/${colname}`, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        listCollections (nsname) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            return get(`${this.#connector}/col/all/${nsname}`, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        createDocument (nsname, colname, docname, docdata) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            if (!colname) throw new ClientError('Missing Parameter [1]: <collection-name>');
            if (!docname) throw new ClientError('Missing Parameter [2]: <document-name>');
            if (!docdata) throw new ClientError('Missing Parameter [3]: <document-data>');
            return post(`${this.#connector}/doc/new/${nsname}/${colname}/${docname}`, docdata, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        removeDocument (nsname, colname, docname) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            if (!colname) throw new ClientError('Missing Parameter [1]: <collection-name>');
            if (!docname) throw new ClientError('Missing Parameter [2]: <document-name>');
            return get(`${this.#connector}/doc/del/${nsname}/${colname}/${docname}`, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        fetchDocument (nsname, colname, docname) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            if (!colname) throw new ClientError('Missing Parameter [1]: <collection-name>');
            if (!docname) throw new ClientError('Missing Parameter [2]: <document-name>');
            return get(`${this.#connector}/doc/get/${nsname}/${colname}/${docname}`, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        listDocuments (nsname, colname) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            if (!colname) throw new ClientError('Missing Parameter [1]: <collection-name>');
            return get(`${this.#connector}/doc/all/${nsname}/${colname}`, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        createNamespaceUser (nsname, username, password) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            if (!username) throw new ClientError('Missing Parameter [1]: <username>');
            if (!password) throw new ClientError('Missing Parameter [2]: <password>');
            return post(`${this.#connector}/doc/all/${nsname}/${username}`, password, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        removeNamespaceUser (nsname, username) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            if (!username) throw new ClientError('Missing Parameter [1]: <username>');
            return get(`${this.#connector}/usr/del/${nsname}/${username}`, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        getNamespaceUser (nsname, username) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            if (!username) throw new ClientError('Missing Parameter [1]: <username>');
            return get(`${this.#connector}/usr/get/${nsname}/${username}`, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

        listNamespaceUsers (nsname) {
            if (!this.#auth.ns[nsname]?.user || !this.#auth.ns[nsname]?.pass) throw new ClientError('Missing Namespace-Level Credentials');
            if (!nsname) throw new ClientError('Missing Parameter [0]: <namespace-name>');
            return get(`${this.#connector}/usr/all/${nsname}`, this.#auth.ns[nsname]?.user, this.#auth.ns[nsname]?.pass);
        };

};

module.exports = Client;