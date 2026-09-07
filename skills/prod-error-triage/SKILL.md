---
name: prod-error-triage
description: Use to find and triage a production error or incident. Starts from the authoritative error source - the channel that actually captures every unhandled exception - rather than the dashboard everyone assumes is complete but is silently empty. Covers locating the real source, mapping an error to the environment and tier that produced it, filtering known baseline noise, and separating a brand-new incident from recurring background failures before reading the stack. Triggers on prod error, production exception, "why did X fail in prod", incident, stack trace triage.
---

# prod-error-triage

When something breaks in production, the first question isn't "what's the error." It's "where does the truth actually live." The obvious dashboard is often the wrong one.

## Find the authoritative source first

Monitoring degrades silently. A telemetry service can be missing the exact category you need, a log store can be dead while still existing, and the dashboard shows an empty, reassuring green. Know which channel *actually* captures every unhandled exception. That durable source is where triage starts, not the prettiest one.

## Triage discipline

- **Map error to environment.** Disambiguate which environment and tier produced it before chasing it (a host header, a subject prefix, a tag). Chasing a staging error as if it were production burns the incident.
- **Filter baseline noise.** Know your recurring background failures so a benign, known daily error doesn't get escalated as new.
- **New vs. recurring.** Separate "this just started" from "this has failed quietly for months." They need very different responses, and confusing them sends you down the wrong path.

## Then read the stack

Only once you know the error is real, current, and from the environment you think it's from does the stack trace mean what it appears to mean.
