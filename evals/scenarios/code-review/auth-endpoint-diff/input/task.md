<!-- Eval fixture for the code-review skill: the task context the change
     implements. The reviewer must check the diff against these acceptance
     criteria. -->

# Task 2.3: Password reset request endpoint

- **Requirements**: FR-4, NFR-2
- **Acceptance Criteria**:
  - [ ] `POST /api/password-reset` accepts an email and always returns 202
  - [ ] A reset token is generated and stored with a 1-hour expiry
  - [ ] The response never reveals whether the email is registered
  - [ ] Requests are rate limited to 5 per hour per IP (NFR-2)
