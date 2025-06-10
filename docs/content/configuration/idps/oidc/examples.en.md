---
title: Examples of OIDC configurations
description: Examples of OIDC provider configurations for popular services
weight: 200
tags:
    - configuration
    - identity provider
    - idp
    - authentication
    - OAuth2
    - OIDC
    - OpenID Connect
seeAlso:
    - /configuration/backend/secrets
    - /configuration/frontend/domain/authentication
    - /configuration/idps/oidc
---

Below you can find some examples of common [OpenID Connect](../oidc) (OIDC) providers.

<!--more-->

## Common steps {#common}

After you finished adding OIDC provider configuration, you need to restart Comentario, then navigate to domain settings and activate that provider on the [Authentication tab](/configuration/frontend/domain/authentication).

{{< callout "warning" "WARNING" >}}
Comentario will not start if the provided configuration is incomplete or incorrect, including situations when requesting the `.well-known/openid-configuration` document from the server fails for any reason.
{{< /callout >}}

## Discord

Discord provides complete support for OIDC. In order to connect login via Discord:

1. Create an application on Discord by visiting [Discord Applications](https://discord.com/developers/applications) page.
2. Select the **OAuth2** item in the sidebar menu.
3. Copy your *key* and *secret*.
4. Add the following redirect URL: `https://<your-comentario-domain>/api/oauth/oidc:discord/callback`
5. Save your changes.
6. Update the [secrets configuration](/configuration/backend/secrets) with the above data:
```yaml
idp:
  oidc:
    - id: discord
      name: Discord
      url: https://discord.com
      scopes:
        - openid
        - identify
        - email
      key: <YOUR_DISCORD_CLIENT_ID>        # Put the correct value here
      secret: <YOUR_DISCORD_CLIENT_SECRET> # And here
```
7. Restart Comentario and enable **Discord** in the domain settings as described [above](#common).
