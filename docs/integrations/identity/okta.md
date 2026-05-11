---
title: Okta Integration — Priorities.ai
description: Configure SAML/OIDC SSO with Okta for your Priorities.ai workspace.
audience: Developers, IT administrators
status: published
---

# Okta

Configure single sign-on for your Priorities.ai workspace using Okta SAML 2.0 or OIDC.

**SSO Status:** ✅ Shipped
**SCIM Provisioning:** Planned

---

## SAML 2.0 configuration

### In Okta

1. Open the Okta Admin Console → Applications → Create App Integration
2. Select **SAML 2.0**
3. Configure the SAML settings:

| Okta field | Value |
|-----------|-------|
| Single sign-on URL | `https://<project>.supabase.co/auth/v1/sso/saml/acs` |
| Audience URI (SP Entity ID) | `https://<project>.supabase.co` |
| Name ID format | EmailAddress |
| Application username | Email |

4. Add attribute statements:

| Name | Value |
|------|-------|
| `email` | `user.email` |
| `first_name` | `user.firstName` |
| `last_name` | `user.lastName` |

5. Download the SAML metadata XML.

### In Priorities.ai

Go to **Settings → Single Sign-On** and paste the SAML metadata XML. Or configure via API:

```bash
curl -X PATCH "$PAI_BASE/workspace" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "sso_enabled": true,
      "sso_provider": "okta",
      "sso_config": {
        "metadata_xml": "<?xml version=\"1.0\"?>..."
      }
    }
  }'
```

---

## OIDC configuration

1. In Okta: create an OIDC Web Application
2. Add `https://<project>.supabase.co/auth/v1/callback` to the allowed redirect URIs
3. Note the **Client ID** and **Client Secret**
4. In Priorities.ai Settings → SSO, configure with the client ID, client secret, and Okta domain

---

## User provisioning (manual)

With SSO configured but SCIM not yet available, users are provisioned by:
1. The user signs in via SSO for the first time — a workspace member record is created
2. An admin assigns the correct role in **Settings → Members**

For bulk provisioning, use the members API:

```bash
POST /v1/workspace/members/invite
{ "email": "new-user@example.com", "role": "contributor" }
```

---

## SCIM automatic provisioning *(planned)*

SCIM will allow Okta to automatically provision and deprovision Priorities.ai workspace members based on group assignments in Okta. When shipped, this will also sync role assignments.

[Contact us →] to be notified.
