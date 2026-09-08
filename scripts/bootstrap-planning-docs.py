#!/usr/bin/env python3
"""Restore the approved design specification and implementation plans.

The handoff payloads are gzip-compressed and base64-encoded so the repository
can be bootstrapped through GitHub's text-only connector. This script restores
the exact approved Markdown files and verifies their SHA-256 hashes.
"""

from __future__ import annotations

import base64
import gzip
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAYLOAD_DIR = ROOT / ".planning-payload"

FILES: dict[str, tuple[str, str]] = {
    "2026-09-08-portfolio-website-design.md": (
        "docs/superpowers/specs/2026-09-08-portfolio-website-design.md",
        "19b63dc1aa23b7c2e4d997cc717164468e87462f260d5ba4a57314f275193b80",
    ),
    "2026-09-08-portfolio-roadmap.md": (
        "docs/superpowers/plans/2026-09-08-portfolio-roadmap.md",
        "5caa2dbf7fe71c626a2c4218293c3643efec41d4951c5483e28de32f0f2b78ac",
    ),
    "2026-09-08-portfolio-foundation-content-system.md": (
        "docs/superpowers/plans/2026-09-08-portfolio-foundation-content-system.md",
        "31c61a049a66d6b326afb291c130741c68208e82bd47df523e53f2244e8cacbb",
    ),
    "2026-09-08-portfolio-home-project-experience.md": (
        "docs/superpowers/plans/2026-09-08-portfolio-home-project-experience.md",
        "9a9a48c547bdd0b05d2d4ae602ca5310d310e76a4dbc84c313b24751891ef619",
    ),
    "2026-09-08-portfolio-writing-search-seo.md": (
        "docs/superpowers/plans/2026-09-08-portfolio-writing-search-seo.md",
        "82c526d0809d6ceea3133c4409e09ec51eb5ca6e6d89048f57ba03546ae9420f",
    ),
    "2026-09-08-portfolio-ai-assistant.md": (
        "docs/superpowers/plans/2026-09-08-portfolio-ai-assistant.md",
        "8863dbd140db1647f65d00ac468e1fc3023e8275c765211e82a72640a3a868b3",
    ),
    "2026-09-08-portfolio-contact-analytics-launch.md": (
        "docs/superpowers/plans/2026-09-08-portfolio-contact-analytics-launch.md",
        "670982cf29235c75f26ca28439f00ae98cec340ba8ddd3050d57bf560171b67f",
    ),
}


def restore(filename: str, target_rel: str, expected_sha256: str) -> None:
    payload = PAYLOAD_DIR / f"{filename}.gz.b64"
    if not payload.exists():
        raise FileNotFoundError(f"Missing planning payload: {payload.relative_to(ROOT)}")

    encoded = "".join(payload.read_text(encoding="utf-8").split())
    data = gzip.decompress(base64.b64decode(encoded, validate=True))
    digest = hashlib.sha256(data).hexdigest()
    if digest != expected_sha256:
        raise RuntimeError(
            f"Checksum mismatch for {filename}: expected {expected_sha256}, got {digest}"
        )

    target = ROOT / target_rel
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    print(f"restored {target.relative_to(ROOT)}")


def main() -> None:
    for filename, (target, checksum) in FILES.items():
        restore(filename, target, checksum)
    print("Planning documents restored and checksums verified.")


if __name__ == "__main__":
    main()
