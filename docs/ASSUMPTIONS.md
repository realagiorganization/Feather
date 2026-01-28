# Assumptions

- Fastlane uses the default scheme name `Feather` unless overridden by `FEATHER_SCHEME`.
- The app identifier defaults to `thewonderofyou.Feather` when `APP_IDENTIFIER` is not provided.
- Test coverage in CI is represented by the BDD suite runner (`python scripts/run_bdd.py`).
- The UI testing GIF is generated from the provided GitHub Pages screenshots because no automated UI recording was present in-repo.
