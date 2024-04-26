const validateToken = (token: any) => {
    const validToken = token.length;
    if (!token || !validToken) {
        return false
    }
    return true;
}

export function autheMiddleware(req: Request): any {
    const token = req.headers.get("authorization")?.split(" ")[1];

    return { isValid: validateToken(token) }
}