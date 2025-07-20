---
title: Static configuration
description: Comentario command-line and environment configuration
weight: 10
tags:
    - configuration
    - secrets
    - CLI
    - command line
    - environment
    - IP
    - logging
    - debug
    - Live update
    - legal
    - terms of service
    - privacy policy
---

The static, or start-up, configuration of Comentario server can be set using command-line options or environment variables. Both methods are equivalent, with command-line options taking precedence.

<!--more-->

## Command-line help

Some command-line options have an equivalent setting in the form of an environment variable. You can get a complete list of supported options and variables by running:

```bash
./comentario -h
```

## Synopsis

```bash
comentario [OPTIONS]
```

## Options

Below is a list of available command-line options, with their environment equivalents (names starting with a `$`).

`-h`, `--help`
: Show help message (option summary) and exit.

`--cleanup-timeout`=VALUE
: Grace period for which to wait before killing idle connections.
: *Default value:* `10s`

`--graceful-timeout`=VALUE
: Grace period for which to wait before shutting down the server.
: *Default value:* `15s`

`--max-header-size`=VALUE
: Maximum number of bytes to read for request header (not request body).
: *Default value:* `1MiB`

`--socket-path`=VALUE
: The unix socket to listen on.
: *Default value:* `/var/run/comentario.sock`

`--host`=VALUE, `$HOST`
: The IP to listen on. If you want to accept connections from any network interface, use value `0.0.0.0`.
: *Default value:* `localhost`

`--port`=VALUE, `$PORT`
: The port to listen on.
: *Default value:* *Random port number*

`--listen-limit`=VALUE
: Limits the number of outstanding requests.

`--keep-alive`=VALUE
: Sets the TCP keep-alive timeouts on accepted connections.
: *Default value:* `3m`

`--read-timeout`=VALUE
: Maximum duration before timing out read of the request.
: *Default value:* `30s`

`--write-timeout`=VALUE
: Maximum duration before timing out write of the response.
: *Default value:* `60s`

`-v`, `--verbose`
: Verbose logging (use `-vv` for debug logging).

`--no-color`, `$NO_COLOR`
: Disable log colouring

`--base-url`=VALUE, `$BASE_URL`
: Server's own [base URL](/kb/base-url).
: *Default value:* `http://localhost:8080`

`--base-docs-url`=VALUE, `$BASE_DOCS_URL`
: Base documentation URL. Comentario provides numerous links to various docpages in the Admin UI and the embedded part. The base URL of the documentation site points to Comentario production documentation by default.
: *Default value:* `https://docs.comentario.app`

`--tos-url`=VALUE, `$TOS_URL`
: URL of the Terms of Service page. Comentario provides users with links to the **Terms of Service** page in a number of places. Apart from being required by law in many countries, such a page is often mandatory when configuring [federated authentication](../idps) via an external service. By default, the [](/legal/tos) URL on the documentation website (see `--base-docs-url` above) is used.
: If you apply your own policies, you should reconfigure Comentario to using your own page URL. This page has to be hosted elsewhere as Comentario provides no means for storing it at the moment.
: *Default value:* `<base docs URL>/en/legal/tos/`

`--privacy-policy-url`=VALUE, `$PRIVACY_POLICY_URL`
: URL of the Privacy Policy page. Comentario provides users with links to the **Privacy** page in a number of places. Apart from being required by law in many countries, such a page is often mandatory when configuring [federated authentication](../idps) via an external service. By default, the [](/legal/privacy) URL on the documentation website (see `--base-docs-url` above) is used.
: If you apply your own policies, you should reconfigure Comentario to using your own page URL. This page has to be hosted elsewhere as Comentario provides no means for storing it at the moment.
: *Default value:* `<base docs URL>/en/legal/privacy/`

`--cdn-url`=VALUE, `$CDN_URL`
: Static file CDN URL.
: *Default value:* The [base URL](/kb/base-url)

`--email-from`=VALUE, `$EMAIL_FROM`
: 'From' address in sent emails.
: *Default value:* SMTP username (`smtpServer.username` [secret](secrets) value)

`--db-idle-conns`=VALUE, `$DB_MAX_IDLE_CONNS`
: Maximum number of idle DB connections.
: *Default value:* `50`

`--disable-xsrf`
: Disable XSRF protection. This option is meant for development purposes only; each production environment should have XSRF protection activated.

`--enable-swagger-ui`
: Enable Swagger UI at `/api/docs`.

`--static-path`=VALUE, `$STATIC_PATH`
: Path to static files.
: *Default value:* `.`

`--db-migration-path`=VALUE, `$DB_MIGRATION_PATH`
: Path to DB migration files.
: *Default value:* `.`

`--db-debug`
: Enable database debug logging. This option is meant for development purposes only.

`--template-path`=VALUE, `$TEMPLATE_PATH`
: Path to template files.
: *Default value:* `.`

`--secrets`=VALUE, `$SECRETS_FILE`
: Path to YAML file with [secrets](secrets).
: *Default value:* `secrets.yaml`

`--superuser`=VALUE, `$SUPERUSER`
: UUID or email of a user to become a [superuser](/kb/permissions/superuser).

`--log-full-ips`, `$LOG_FULL_IPS`
: Log IP addresses in full. If this options is omitted, only the first two bytes of IP addresses will be stored in corresponding fields, such as user's signup IP. This applies to both IPv4 (e.g. `172.168.x.x`) and IPv6 (e.g. `692e:eace:x:x:x:x:x:x`) addresses.

`--home-content-url`=VALUE, `$HOME_CONTENT_URL`
: URL of a HTML page to display on homepage.

`--gitlab-url`=VALUE, `$GITLAB_URL`
: Custom GitLab URL for authentication.

`--no-live-update`, `$NO_LIVE_UPDATE`
: Disable [live updates](/kb/live-update) via WebSockets.

`--no-page-view-stats`, `$NO_PAGE_VIEW_STATS`
: Disable page view statistics gathering and reporting.

`--stats-max-days`, `$STATS_MAX_DAYS`
: Statistics retention and reporting period, in days.
: *Default value:* `30`

`--max-import-file-size`, `$MAX_IMPORT_FILE_SIZE`
: Maximum import file size. This can be either a number of bytes, or a number followed by a unit (`B`=bytes, `KB`=kilobytes, `MB`=megabytes etc.).
: *Default value:* `10MiB`

`--ws-max-clients`=VALUE, `$WS_MAX_CLIENTS`
: Maximum number of WebSocket clients available for [](/kb/live-update).
: *Default value:* `10000`

`--e2e`
: Start server in the end-to-end testing mode. This option is meant for development purposes only.
