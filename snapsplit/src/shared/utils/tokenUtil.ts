export const setAccessToken = (token: string) => {
    localStorage.setItem("accessToken", token);
};

export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

export const removeAccessToken = () => {
    localStorage.removeItem("accessToken");
};

export const setRefreshToken = (token: string) => {
    localStorage.setItem("refreshToken", token);
};

export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

export const removeRefreshToken = () => {
    localStorage.removeItem("refreshToken");
};
