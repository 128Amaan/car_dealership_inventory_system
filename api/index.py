"""Vercel serverless entry point.

Reuses the FastAPI app from ``backend/app/main.py``. Vercel's Python runtime
auto-discovers an ASGI ``app`` symbol at the module top level.

Caveat: Vercel's Python functions run on an ephemeral filesystem, so the
SQLite file resets on cold starts. This deployment is for demo purposes;
swap ``DATABASE_URL`` to a hosted Postgres (Neon / Supabase) for persistence.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

# Default DB to the writable /tmp dir on Vercel
os.environ.setdefault("DATABASE_URL", "sqlite:////tmp/dealership.db")

from app.main import app  # noqa: E402  (import after sys.path tweak)

# Vercel looks for `app`
__all__ = ["app"]
