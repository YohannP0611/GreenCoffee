# UML diagrams

These diagrams use Mermaid syntax. They render natively on GitHub.

## 1. Use case diagram

```mermaid
flowchart LR
    Visitor((Visitor))
    User((Authenticated user))
    Admin((Administrator))

    subgraph System["Green Coffee"]
        UC1[Browse coffee list]
        UC2[View coffee detail]
        UC3[Filter by variety / origin]
        UC4[Sign up]
        UC5[Log in / Log out]
        UC6[Add a coffee]
        UC7[Edit own coffee]
        UC8[Delete own coffee]
        UC9[Manage users CRUD]
        UC10[Edit / delete any coffee]
    end

    Visitor --> UC1
    Visitor --> UC2
    Visitor --> UC3
    Visitor --> UC4
    Visitor --> UC5

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC5
    Admin --> UC6
    Admin --> UC9
    Admin --> UC10

    User -.->|extends| Visitor
    Admin -.->|extends| User
```

## 2. Class diagram (logical data model)

```mermaid
classDiagram
    class User {
        +int id PK
        +string email UNIQUE
        +string name
        +string password_hash
        +string role: user|admin
        +datetime created_at
        +login(password)
        +canEdit(coffee)
    }

    class Coffee {
        +int id PK
        +string name
        +string origin
        +string region
        +string variety: Arabica|Robusta|Liberica|Excelsa
        +string process: Washed|Natural|Honey|Anaerobic
        +int altitude_m
        +string tasting_notes
        +string description
        +int created_by FK
        +datetime created_at
    }

    class Session {
        +string sid PK
        +int userId
        +datetime expires
    }

    User "1" --> "0..*" Coffee : creates
    User "1" --> "0..*" Session : opens
```

## 3. Sequence diagram: log in

```mermaid
sequenceDiagram
    actor U as User
    participant B as Browser
    participant S as Express server
    participant DB as SQLite

    U->>B: Fills login form
    B->>S: POST /login (email, password)
    S->>S: Validate email regex
    alt Invalid format
        S-->>B: 400 + error page
    else Valid format
        S->>DB: SELECT id, password_hash, role FROM users WHERE email=?
        DB-->>S: row or null
        alt No row OR bcrypt.compare fails
            S-->>B: 401 + error page
        else Match
            S->>S: Create session (req.session.userId = id)
            S-->>B: 302 Set-Cookie + redirect /dashboard
            B->>S: GET /dashboard (Cookie: gc.sid)
            S->>DB: SELECT my coffees WHERE created_by=?
            DB-->>S: coffees[]
            S-->>B: 200 + dashboard HTML
        end
    end
```

## 4. Sequence diagram: create a coffee

```mermaid
sequenceDiagram
    actor U as Logged-in user
    participant B as Browser
    participant S as Express server
    participant DB as SQLite

    U->>B: Fills /coffees/new form
    B->>S: POST /coffees/new
    S->>S: requireAuth middleware
    alt No session
        S-->>B: 302 -> /login?next=/coffees/new
    else Session valid
        S->>S: sanitize() + validate()
        alt Invalid input
            S-->>B: 400 + form with errors
        else Valid
            S->>DB: INSERT INTO coffees (..., created_by) VALUES (?, ..., ?)
            DB-->>S: lastInsertRowid
            S-->>B: 302 -> /coffees/{id}
        end
    end
```

## 5. High-level architecture

```mermaid
flowchart TB
    Client[Browser<br/>HTML + CSS]
    CDN[Reverse proxy<br/>gzip / brotli]
    Server[Express<br/>Node.js >=22.5]
    DB[(SQLite<br/>local file)]

    Client -->|HTTP| CDN
    CDN -->|HTTP| Server
    Server -->|node:sqlite| DB
    Server -->|template literals| Server
```
