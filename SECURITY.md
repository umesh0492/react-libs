# Security Policy

The `@umesh0492/react-libs` team takes security issues seriously and welcomes reports from developers, security researchers, and the open-source community.

## Supported Versions

Only the current and recent active releases receive security updates and bug fixes:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

We strongly advise all users to stay updated with the latest releases to ensure optimal security and compatibility.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

If you believe you have discovered a security vulnerability in `@umesh0492/react-libs`, please report it responsibly by following these steps:

1. Send an email directly to **[umesh0492@gmail.com](mailto:umesh0492@gmail.com)** with the subject line:  
   `[Security Vulnerability]: @umesh0492/react-libs - <Brief Description>`
2. Include the following information in your report:
   - A clear description of the vulnerability and its potential impact.
   - The version(s) of `@umesh0492/react-libs` affected.
   - Step-by-step reproduction instructions or a minimal proof-of-concept (PoC) repository / script.
   - Any proposed remediation, patch, or mitigation strategy (if available).
   - Your preferred name / handle for attribution in release notes (optional).

## Response & Disclosure Process

When a security vulnerability is reported:

1. **Acknowledgment**: You will receive an acknowledgment within 48 hours confirming receipt of your report.
2. **Assessment & Validation**: The maintainers will investigate and determine the severity, affected versions, and exploitability.
3. **Patch Development**: A fix will be developed, tested, and verified privately.
4. **Release & Advisory**: Once a patch is released on npm and GitHub, a security advisory will be published detailing the vulnerability, impacted versions, and upgrade instructions, with full credit to the reporter.

## Security Best Practices for Consumers

- Keep `@umesh0492/react-libs` and peer dependencies (`react`, `react-dom`) updated to their latest compatible versions.
- Regularly run `npm audit` in your application repositories.
- Follow WCAG accessibility and Content Security Policy (CSP) best practices when integrating component wrappers and rendering rich content.
