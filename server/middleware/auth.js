export function getTokenFromRequest(req) {
    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.slice(7);
    }

    const cookies = req.headers.cookie?.split(';').reduce((values, cookie) => {
        const [name, ...value] = cookie.trim().split('=');
        if (name) values[name] = decodeURIComponent(value.join('='));
        return values;
    }, {});

    return cookies?.av_token || null;
}
