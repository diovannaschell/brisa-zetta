// loginService.js
const db = require('./database') // hypothetical database module

exports.login = async (credentials) => {
    const user = await db.findUser(credentials.username);
    if (user && user.password === credentials.password) {
        return user;
    }
    return null;
}

