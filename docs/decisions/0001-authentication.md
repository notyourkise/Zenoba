# 0001 — Authentication Provider Selection

**Status:** Accepted  
**Date:** 2026-08-24  
**Authors:** Netloka Development Team

---

## Context and Problem Statement

For MVP development, we need to select an authentication provider that:
1. Integrates seamlessly with Next.js App Router
2. Supports credential-based authentication for user accounts (email/password)
3. Has mature PostgreSQL/Prisma integration
4. Provides strong session security with minimal configuration complexity
5. Is actively maintained with clear migration paths
6. Does not require excessive abstraction for our use case

Two primary candidates were evaluated: **Better Auth** and **NextAuth.js (Auth.js)**

---

## Decision Drivers

### Technical Requirements
- **Next.js Compatibility:** Must support App Router patterns (Server Components, Route Handlers)
- **Database Integration:** First-class Prisma ORM support recommended
- **Session Security:** Secure token handling, refresh tokens, secure cookie defaults
- **Migration Complexity:** Minimal breaking changes anticipated during MVP development

### Community and Maintenance
- **Active Maintenance:** Recent releases, responsive issue tracking
- **TypeScript Support:** Native TypeScript definitions and examples
- **Documentation Quality:** Clear API documentation with examples
- **Community Size:** Sufficient user base for third-party resources

### Architecture Fit
- **Extensity:** Ability to add social login later without major rewrites
- **Flexibility:** Custom adapter support for database operations
- **Security Model:** Built-in protection against common vulnerabilities

---

## Options Evaluated

### Option A: Better Auth

**Version:** 1.7.x (as of 2026-08-24)  
**License:** MIT

**Pros:**
- Modern architecture with built-in type safety
- Simplified developer experience
- Good Next.js App Router integration out-of-box
- Active development with regular releases

**Cons:**
- Newer ecosystem with fewer community resources
- Limited third-party integrations compared to established alternatives
- Documentation may evolve as the project matures

**Relevant Links:**
- GitHub: `github.com/better-auth`
- Documentation: TBD (check official docs at implementation time)

---

### Option B: NextAuth.js (v5 / Auth.js Core)

**Version:** 5.x (stable), 4.24.x LTS

**Pros:**
- Industry standard for Next.js authentication
- Extremely mature with extensive documentation
- Large community with abundant third-party resources
- Battle-tested across thousands of production applications
- Official support from Vercel team

**Cons:**
- Multiple major versions (v4 vs v5) can cause confusion
- Some complexity in configuration for custom providers
- Migration path between v4 and v5 requires careful planning

**Relevant Links:**
- Repository: `next-auth.js.org` / `github.com/nextauthjs`
- Documentation: Official docs include full App Router guide

---

### Option C: Custom Implementation

Building auth from scratch using JWT + bcrypt.

**Pros:**
- Complete control over implementation
- No external dependencies

**Cons:**
- High security risk if not implemented by cryptography experts
- Wastes engineering resources on solved problem
- Difficult to maintain long-term
- Violates YAGNI principle when proven solutions exist

**Recommendation:** Not recommended for MVP or production use

---

## Decision Outcome

### Selected Option: **NextAuth.js (v5 / Auth.js Core)**

**Rationale:**
1. **Maturity and Reliability:** As the de facto standard for Next.js auth, v5 provides a stable foundation with proven security patterns
2. **Prisma Integration:** Direct first-party integration via `@prisma/client/adapters` eliminates middleware complexity
3. **Ecosystem Maturity:** Extensive documentation, troubleshooting guides, and community knowledge reduce development risk
4. **Scalability:** Easy to add social providers (GitHub, Google, etc.) later through adapter pattern
5. **Vercel Backing:** Ongoing maintenance and roadmap alignment with Next.js evolution

### Rejected Alternative: Better Auth
While newer and architecturally elegant, Better Auth lacks the maturity and community support needed for production MVP where stability takes precedence over novelty.

---

## Acceptance Criteria

The selected solution must satisfy all requirements:

- ✅ Next.js 16.x + TypeScript 5.x compatible
- ✅ Credential-based auth (email/password) working in app router
- ✅ Prisma ORM integration via official adapter
- ✅ Session management with secure cookies
- ✅ Protected routes enforceable server-side
- ✅ Social login ready through adapters (deferred to future sprint)
- ✅ Type-safe API throughout application

---

## Implementation Notes

1. **Install packages:**
   ```bash
   npm install next-auth @prisma/client prisma @auth/prisma-adapter
   ```

2. **Configure schema** (update existing `prisma/schema.prisma`):
   - Extend default User model as needed
   - Add OAuth Account/Session models if using adapters
   
3. **Security considerations:**
   - Use secure HTTP-only cookies for sessions
   - Implement rate limiting on auth endpoints
   - Validate email domains during registration
   - Store password hashes using Argon2 or bcrypt (default)

4. **Access tokens strategy:**
   - Implement refresh token rotation for long-lived sessions
   - Store sensitive tokens encrypted if persisted

---

## Related Work Items

- [Sprint 1 Task 1.1] Implement sign-up/sign-in/sign-out flows
- [Sprint 1 Task 1.1] Protect app routes with auth guards
- [Future Sprint] Add social login providers (GitHub, Google)

---

## References

- NextAuth.js v5 Docs: `https://next-auth.js.org/getting-started/introduction`
- Prisma Adapter Guide: `https://next-auth.js.org/adapters/prisma`
- Security Best Practices: `https://next-auth.js.org/configuration/options`
