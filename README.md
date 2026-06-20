# Andrew's Bachelor Bash

Single-page event hub: schedule, costs, cost-per-person, and a Venmo/Zelle
chip-in section. Plain HTML/CSS/JS, no build step.

The exact address for the after-party house is intentionally left off the
page ("Address sent separately") — it's the one private detail, sent
directly to the group via text instead.

## Updating the schedule / costs / payment info

Edit `js/data.js` directly and push — the page renders straight from that
object, no build step needed.

## Running locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000
