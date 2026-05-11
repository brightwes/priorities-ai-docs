---
title: SCIM Provisioning — Priorities.ai
description: Automated user lifecycle management via SCIM 2.0. Planned.
audience: IT administrators, developers
status: planned
---

> **Note (Coming soon):** SCIM provisioning is planned and not yet shipped. This page documents the intended interface.

---

# SCIM Provisioning *(planned)*

SCIM (System for Cross-domain Identity Management) 2.0 will allow your identity provider to automatically provision and deprovision Priorities.ai workspace members based on group assignments.

**Supported providers when shipped:** Okta, Entra ID, Ping Identity, OneLogin, any SCIM 2.0-compatible IDP

---

## Planned capabilities

| Capability | Supported |
|------------|----------|
| User create | ✓ |
| User update (name, email) | ✓ |
| User deactivate | ✓ (removes workspace access) |
| User delete | ✓ |
| Group provisioning → role mapping | ✓ |

---

## Planned endpoint

```
/scim/v2/Users
/scim/v2/Groups
```

Authentication: Bearer token (SCIM provisioning token, separate from API keys)

---

## Role mapping *(planned)*

Groups in your IDP will map to Priorities.ai roles:

| IDP Group | Priorities.ai Role |
|-----------|-------------------|
| `priorities-admins` | `admin` |
| `priorities-facilitators` | `facilitator` |
| `priorities-contributors` | `contributor` |
| `priorities-observers` | `observer` |

Configurable in workspace SCIM settings.

---

## In the meantime

Provision users via:
- **App UI:** Settings → Members → Invite
- **API:** `POST /v1/workspace/members/invite`
- **SSO just-in-time provisioning:** Users who sign in via SAML/OIDC for the first time are automatically provisioned; an admin assigns their role

[Guide: provision with SCIM →](/docs/guides/provision-with-scim) *(planned)*
