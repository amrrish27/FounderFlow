import os
import sys

from starlette.types import ASGIApp, Receive, Scope, Send

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)

from app import app as fastapi_app


class StripApiPrefix:
    """Strip Vercel's /api prefix before handing the request to FastAPI."""

    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            if path == "/api":
                scope = dict(scope)
                scope["path"] = "/"
                scope["raw_path"] = b"/"
            elif path.startswith("/api/"):
                scope = dict(scope)
                new_path = path[4:] or "/"
                scope["path"] = new_path
                scope["raw_path"] = new_path.encode("utf-8")
        await self.app(scope, receive, send)


app = StripApiPrefix(fastapi_app)
