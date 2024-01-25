const base64 = string => Buffer.from(string, 'utf-8').toString('base64');

const safeJSONparse = (data) => {
    try {
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
}

const buildOptions = (method, data, username, password) => {
    const r = ({
        method: method,
        timeout: 6000, // in ms
        headers: {
            'Authorization': 'Basic ' + base64(`${username}:${password}`)
        }
    });
    if (data) {
        r.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        r.headers['Content-Length'] = data.length;
    };
    return r;
}

const request = (url, options, data) => {
    let scheme = url.startsWith('https') ? require('https') : require('http');
    return new Promise((resolve, reject) => {
        const req = scheme.request(url, options, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                return reject(`HTTP status code ${res.statusCode}`);
            }
            const body = [];
            res.on('data', (chunk) => body.push(chunk));
            res.on('end', () => resolve(safeJSONparse(Buffer.concat(body).toString('utf-8'))));
        });
        req.on('error', (err) => reject(err));
        req.on('timeout', () => { req.destroy(); reject('Request time out'); });
        if (data) req.write(data);
        req.end();
    });
}

const post = (url, data, username, password) => {
    const dataString = (typeof data === 'string') ? data : JSON.stringify(data);
    const options = buildOptions('POST', dataString, username, password);
    return request(url, options, data);
}

const get = (url, username, password) => {
    const options = buildOptions('GET', null, username, password);
    return request(url, options);
}

module.exports = {
    get,
    post
}