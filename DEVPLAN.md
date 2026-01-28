# DEVPLAN

## Goals
- Maintain the Feather iOS app and its supporting tooling.
- Keep release automation (TestFlight + GitHub releases) reliable.
- Capture principal behaviors in a lightweight BDD suite.

## Local setup
1. Install Xcode (latest stable) and accept the license.
2. Install Ruby 3.2+ and Bundler.
3. Install Python 3 for the BDD runner.
4. Clone the repo with submodules.

## Development workflow
1. Open `Feather.xcworkspace` in Xcode.
2. Make Swift/UI changes in `Feather/`.
3. Update assets under `Images/` as needed.
4. Run the BDD suite locally: `python scripts/run_bdd.py`.
5. Validate builds with `bundle exec fastlane ci_build`.

## Testing
- BDD suite lives in `bdd/features/*.feature` and is validated by `scripts/run_bdd.py`.
- GitHub Actions runs the BDD suite on push and PRs.
- Use simulators or devices for UI validation.

## Release workflow
1. Ensure all BDD scenarios are up to date.
2. Create a GitHub release or run the TestFlight workflow manually.
3. Provide App Store Connect API key secrets for CI.
4. The TestFlight workflow builds and uploads via Fastlane.

Required GitHub secrets:
- `APP_IDENTIFIER` (bundle identifier).
- `APPLE_ID` (Apple account email).
- `APPLE_TEAM_ID` (Developer team ID).
- `ASC_KEY_ID` (App Store Connect API key ID).
- `ASC_ISSUER_ID` (App Store Connect issuer ID).
- `ASC_KEY_CONTENT` (Base64-encoded API key content).
- `FEATHER_SCHEME` (optional override for the Xcode scheme).

## External dependencies
Build and automation:
- Xcode + command line tools (iOS builds).
- Ruby + Bundler + Fastlane (TestFlight automation).
- Python 3 (BDD suite runner).
- GitHub Actions (CI/CD, VHS recording).

Runtime features and integrations:
- Zsign for IPA signing.
- Ellekit for tweak injection.
- AltStore-compatible sources for app feeds.
- Vapor for HTTP server functionality.
- Nuke for image caching.
- plistserver for hosted manifest retrieval.
- idevice pairing utilities and AFC/lockdown support.
- backloop.dev wildcard SSL certificates for HTTPS hosting.
