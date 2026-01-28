#!/usr/bin/env python3
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import sys

FEATURES_DIR = Path("bdd/features")

@dataclass
class ScenarioResult:
    name: str
    has_given: bool
    has_when: bool
    has_then: bool

    @property
    def valid(self) -> bool:
        return self.has_given and self.has_when and self.has_then


def parse_feature(path: Path) -> tuple[str | None, list[ScenarioResult], list[str]]:
    feature_name = None
    scenarios: list[ScenarioResult] = []
    errors: list[str] = []
    current: ScenarioResult | None = None
    last_step_type: str | None = None

    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("Feature:"):
            feature_name = line[len("Feature:"):].strip() or None
            continue
        if line.startswith("Scenario Outline:") or line.startswith("Scenario:"):
            if current:
                scenarios.append(current)
            name = line.split(":", 1)[1].strip() or "Unnamed scenario"
            current = ScenarioResult(name=name, has_given=False, has_when=False, has_then=False)
            last_step_type = None
            continue
        if current is None:
            if line.startswith(("Given", "When", "Then", "And", "But")):
                errors.append(f"{path}: step found before Scenario: '{line}'")
            continue
        keyword = line.split(" ", 1)[0]
        if keyword in {"Given", "When", "Then"}:
            last_step_type = keyword
        elif keyword in {"And", "But"}:
            if last_step_type is None:
                errors.append(f"{path}: 'And/But' without previous step in '{current.name}'")
                continue
        else:
            errors.append(f"{path}: unknown step keyword '{keyword}'")
            continue

        if last_step_type == "Given":
            current.has_given = True
        elif last_step_type == "When":
            current.has_when = True
        elif last_step_type == "Then":
            current.has_then = True

    if current:
        scenarios.append(current)

    if feature_name is None:
        errors.append(f"{path}: missing Feature header")

    return feature_name, scenarios, errors


def main() -> int:
    if not FEATURES_DIR.exists():
        print(f"Missing {FEATURES_DIR}", file=sys.stderr)
        return 1

    feature_files = sorted(FEATURES_DIR.glob("*.feature"))
    if not feature_files:
        print(f"No feature files in {FEATURES_DIR}", file=sys.stderr)
        return 1

    failed = False
    for feature in feature_files:
        feature_name, scenarios, errors = parse_feature(feature)
        if errors:
            failed = True
            for error in errors:
                print(f"ERROR: {error}", file=sys.stderr)
        if not scenarios:
            failed = True
            print(f"ERROR: {feature}: no scenarios defined", file=sys.stderr)
            continue
        for scenario in scenarios:
            if not scenario.valid:
                failed = True
                print(
                    "ERROR: {}: scenario '{}' missing steps (Given={}, When={}, Then={})".format(
                        feature,
                        scenario.name,
                        scenario.has_given,
                        scenario.has_when,
                        scenario.has_then,
                    ),
                    file=sys.stderr,
                )

        if not errors:
            print(f"OK: {feature_name or feature.name} ({len(scenarios)} scenarios)")

    if failed:
        return 1

    print(f"BDD suite passed: {len(feature_files)} feature files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
