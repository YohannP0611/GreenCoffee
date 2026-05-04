# Functional test scenarios

Table to fill in during final testing. Status: OK / KO / not tested.

| # | Scenario | Expected result | Status |
|---|----------|-----------------|--------|
| 1 | Sign up with valid email | Account created, redirect /dashboard | OK |
| 2 | Sign up with malformed email | Server-side error, form re-rendered | OK |
| 3 | Sign up with password < 8 chars | Error, form re-rendered | OK |
| 4 | Sign up with email already used | HTTP 409, message "Email already in use" | OK |
| 5 | Log in with valid credentials | Redirect /dashboard | OK |
| 6 | Log in with wrong password | HTTP 401, no session created | OK |
| 7 | Paginated coffee list | 10 per page, working pagination | OK |
| 8 | Coffees filter by variety | Filtered results, params preserved | OK |
| 9 | Coffees filter by origin | LIKE search works | OK |
| 10 | Coffee detail of non-existent id | HTTP 404, readable error page | OK |
| 11 | Create coffee (logged in) | Coffee created, redirect to detail | OK |
| 12 | Create coffee without description | HTTP 400, error displayed | OK |
| 13 | Edit my coffee | Coffee updated, redirect to detail | OK |
| 14 | Edit another user's coffee (non admin) | HTTP 403, action denied | OK |
| 15 | Delete coffee with confirm | Coffee removed, back to /coffees | OK |
| 16 | Access /dashboard without session | Redirect /login?next=/dashboard | OK |
| 17 | Access /users as user | HTTP 403 | OK |
| 18 | Access /users as admin | HTTP 200, paginated list | OK |
| 19 | Admin user CRUD (creation) | User created, password hashed | OK |
| 20 | Delete own admin account | HTTP 400, error displayed | OK |
| 21 | SQL injection attempt via login | HTTP 400 (email regex validation) | OK |
| 22 | Verify passwords in DB | All bcrypt ($2a$/$2b$) | OK |
| 23 | Logout destroys session | Redirect /, dashboard unreachable | OK |
| 24 | Dark mode via prefers-color-scheme | Colours adapt automatically | OK |
| 25 | Keyboard navigation | Skip link works, focus visible | OK |

## Test methodology

Tests run with curl and the following script (excerpt):

```bash
# Login
curl -c cookies.txt -d "email=admin@green.coffee&password=admin1234" \
  http://localhost:3000/login

# Protected access
curl -b cookies.txt http://localhost:3000/dashboard

# Injection attempt
curl -d "email=' OR '1'='1&password=x" http://localhost:3000/login
# Returns: 400 (email validation rejects the payload)

# Verify hashes in DB
node -e "const db=require('./backend/db'); \
  console.log(db.prepare('SELECT password_hash FROM users').all());"
```
