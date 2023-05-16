import jwt_decode from "jwt-decode";

const getToken = () => {
  const tokenString = sessionStorage.getItem('authToken');
  return tokenString;
};

const setToken = authToken => {
  sessionStorage.setItem('authToken', authToken);
};

const removeToken = authToken => {
  sessionStorage.removeItem('authToken');
};

const getTokenProperties = (pty) => {
  const token = getToken();
  if (token) {
    var decoded = jwt_decode(token);
    let properties = {};
    let property = {};
    Object.keys(decoded).forEach(key => {
      let res = key.split("/");
      if (res.length > 1) {
        properties[res[res.length - 1]] = decoded[key];
        if (pty && res[res.length - 1] === pty) {
          property = decoded[key]
        }
      }
    });
    return pty ? property : properties;
  }
}

const compareRole = (roles, currentRole) => {
  let valid = false;
  if (Array.isArray(roles) && typeof currentRole === 'string') {
    roles.forEach(role => {
      if (role === currentRole) valid = true;
    })
  } else if (typeof roles === 'string' && typeof currentRole === 'string') {
    if (roles === currentRole) valid = true;
  } else {
    throw new Error("Your data is not valid")
  }
  return valid;
}

const isExpired = () => {
  const token = getToken();
  if (token) {
    var decoded = jwt_decode(token);
    const expireDate = decoded["exp"];
    const date = new Date(expireDate);
  }

}

export { setToken, getToken, getTokenProperties, compareRole, removeToken, isExpired }
