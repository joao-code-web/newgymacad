import { NextResponse } from "next/server";
import { autheMiddleware } from "./middlewares/apis/autheMiddleware";
import { loggindMiddleware } from "./middlewares/apis/loggingMiddleware";
export const config = {
    matcher: "/api/:patch*"
}

export default function middleware(req: Request) {

    if (req.url.includes("/api/notes")) {
        const logResult = loggindMiddleware(req)
        console.log("Request", logResult);
    }

    const authResult = autheMiddleware(req);
    if (authResult?.isValid) {
        return new NextResponse(JSON.stringify({ message: "não pode" }), {
            status: 401
        })
    }

    return NextResponse.next()
}