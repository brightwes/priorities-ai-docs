---
title: Provision with SCIM — Priorities.ai
description: Automated user lifecycle management via SCIM 2.0. Planned.
audience: IT administrators
status: planned
---

> **Note (Coming soon):** SCIM provisioning is planned and not yet shipped. This guide will be updated with working instructions when it ships.

---

# Provision with SCIM *(planned)*

Automatically provision and deprovision Priorities.ai workspace members from Okta, Entra ID, or any SCIM 2.0-compatible identity provider.

---

## What SCIM will enable

- **Automatic provisioning:** When a user is assigned to the Priorities.ai app in your IDP, they are automatically added to your workspace with the correct role
- **Automatic deprovisioning:** When a user is removed or deactivated in your IDP, they lose workspace access immediately
- **Role sync:** IDP groups map to Priorities.ai roles (admin, facilitator, contributor, observer)
- **Attribute sync:** Name and email changes in the IDP propagate to the workspace

---

## In the meantime

Provision users via:

**Manual invite:**
```bash
POST /v1/workspace/members/invite
{
  "email": "new-user@example.com",
  "role": "contributor",
  "name": "New User"
}
```

**SSO just-in-time provisioning (available today):**

With SAML or OIDC SSO configured, users who sign in for the first time are automatically added to the workspace as observers. An admin then assigns the correct role in **Settings → Members**.

[Configure Okta SSO →](/integrations/identity/okta)
[Configure Entra ID SSO →](/integrations/identity/entra-id)

[Contact us →] to be notified when SCIM ships.
