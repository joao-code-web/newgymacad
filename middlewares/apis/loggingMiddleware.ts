    export function loggindMiddleware(req: Request) {
        return { response: req.method + " " + req.url }
    }