# crowe-nimbus-site

One static page for Crowe Nimbus, a hosted model endpoint service, with two subscribe links that go to Stripe payment pages.

## Status

working. `nimbus.crowelogic.com` resolves (CNAME to `michaelcrowe11.github.io`) and GitHub Pages serves this repository from it over HTTPS. Checked 2026-09-10: `curl -sI https://nimbus.crowelogic.com` returned `HTTP/2 200` with `server: GitHub.com`, and the served HTML was byte-identical to `index.html` at commit 79e92d6. The Pages build comes from branch `main`, path `/`; the certificate on file expires 2026-10-26. What was not checked: the two Stripe payment links (opening them creates checkout sessions, so they were left alone), and the service the page describes, which is not in this repository. `vercel.json` is present but no Vercel deployment was found (`crowe-nimbus-site.vercel.app` returned 404).

## Install and first run

There is no build step and no dependency file. Serve the repository root with any static file server.

```
$ python3 -m http.server 8125 --bind 127.0.0.1
$ curl -sI http://127.0.0.1:8125/ | head -3
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.13.14
Date: Fri, 11 Sep 2026 05:11:58 GMT
$ curl -s http://127.0.0.1:8125/ | grep -o "<title>.*</title>"
<title>Crowe Nimbus</title>
$ curl -sI http://127.0.0.1:8125/sessions/nimbus.json | head -1
HTTP/1.0 200 OK
```

Run on 2026-09-10 with Python 3.13.14 on macOS. Not run: a browser render, `vercel dev`.

## What runs today

- `index.html` (145 lines): nav, hero, six capability cells, two pricing tiers, footer. Loads `crowe-logic.css`, Google Fonts (Fraunces, Inter, JetBrains Mono), and the two scripts below. An inline script adds reveal-on-scroll and a pointer glow on `.glass` panels.
- `thought-streams.js` (122 lines): a full-bleed canvas animation behind the page. No dependencies. Renders one still frame when the browser asks for reduced motion.
- `recorded-terminal.js` (147 lines): a `<recorded-terminal>` custom element that fetches `sessions/nimbus.json` and replays it: types the command, streams the output lines with the recorded delays, then loops.
- `sessions/nimbus.json` (18 lines): the hand-written script the terminal replays, including its "endpoint live" badge.
- `crowe-logic.css` (184 lines): the shared page styles.
- `index.flat-backup.html`: an earlier version of the page in a flat style. Nothing links to it.
- `CNAME`: `nimbus.crowelogic.com`. `vercel.json`: `cleanUrls` and `trailingSlash` only. `.gitignore` excludes `node_modules`, `.vercel`, `.DS_Store`.

## Roadmap

None stated in the repository.

## Limits

- This is the page, not the service. Nothing here provisions endpoints, compute, or gateways. Whether the service described exists was not checked for this README.
- Prices are hardcoded copy (listed in code, `index.html` lines 98 and 111): Nimbus Starter $39 per month, Crowe Nimbus Flagship $99 per month. Each Subscribe button links to a `pay.crowelogic.com/b/...` address; DNS for that host points at Stripe hosted checkout. The links were not opened, so the product, price, and account behind each one are unverified.
- The terminal demo is a replay of a JSON file. It does not run any command and its output is not evidence that anything works.
- Fonts load from Google at runtime; nothing is vendored.
- No analytics, no forms, no tests.

## License and contact

No license file. Contact: michael@crowelogic.com.
