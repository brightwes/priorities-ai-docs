---
title: Entra ID (Azure AD) Integration — Priorities.ai
description: Configure SAML/OIDC SSO with Microsoft Entra ID for your Priorities.ai workspace.
audience: Developers, IT administrators
status: published
---

# Entra ID (Azure Active Directory)

Configure single sign-on for your Priorities.ai workspace using Microsoft Entra ID (formerly Azure Active Directory) SAML 2.0 or OIDC.

**SSO Status:** ✅ Shipped
**SCIM Provisioning:** Planned

---

## SAML 2.0 configuration

### In the Azure portal

1. Go to **Azure Active Directory → Enterprise Applications → New Application**
2. Select **Create your own application** → Non-gallery
3. Go to **Single Sign-On** → **SAML**
4. Configure Basic SAML:

| Field | Value |
|-------|-------|
| Identifier (Entity ID) | `https://<project>.supabase.co` |
| Reply URL (ACS URL) | `https://<project>.supabase.co/auth/v1/sso/saml/acs` |
| Sign on URL | `https://<project>.supabase.co` |

5. Add attribute claims:

| Claim name | Source attribute |
|------------|-----------------|
| `email` | `user.mail` |
| `first_name` | `user.givenname` |
| `last_name` | `user.surname` |

6. Download the Federation Metadata XML.

### In Priorities.ai

**Settings → Single Sign-On** → paste the Federation Metadata XML.

---

## OIDC configuration

1. In Azure: register a new application → Platform: Web
2. Add redirect URI: `https://<project>.supabase.co/auth/v1/callback`
3. Create a client secret
4. Note the **Application (client) ID**, **Directory (tenant) ID**, and client secret
5. In Priorities.ai Settings → SSO, configure with these values

---

## SCIM provisioning *(planned)*

When SCIM ships, Entra ID will provision and deprovision workspace members automatically via the `/scim/v2/` endpoint, with group-to-role mapping.
