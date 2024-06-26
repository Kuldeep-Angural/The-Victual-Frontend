import { SESSION_KEYS } from "./constants";

export const createSession = (token) => {
    console.log(token);
    const jwt = parseJwt(token);
    if (jwt) {
        const exp = new Date(jwt.exp * 1000);
        localStorage.setItem(SESSION_KEYS.TOKEN, token);
        localStorage.setItem(SESSION_KEYS.EXPIRY, exp.getTime());
    }
    else{
        window.location.href = window.location.origin+process.env.REACT_APP_BASE_NAME+"/";
    }
}

const  parseJwt = (token) => {
    if (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
};

export function isAuthenticated() {
    const token = localStorage.getItem(SESSION_KEYS.TOKEN);
    if (token && isExpired()) {
        invalidateSession();
        return false;
    }
    return token ? true : false;
}

function isExpired() {
    const exp = localStorage.getItem(SESSION_KEYS.EXPIRY);
    if (Date.now() <= exp) {
        return false;
    }
    return true;
}

export const createUser = ({ id, name, email, mobile, role }) => {
    localStorage.setItem(SESSION_KEYS.USERS, JSON.stringify({ id, name, email, mobile, role }));
}


export function invalidateSession() {
    localStorage.removeItem(SESSION_KEYS.TOKEN);
    localStorage.removeItem(SESSION_KEYS.REFRESHTOKEN)
    localStorage.removeItem(SESSION_KEYS.EXPIRY);
    localStorage.removeItem(SESSION_KEYS.USERS);
    
}