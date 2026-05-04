# Low-fidelity wireframes

ASCII / textual wireframes that respect the visual sobriety of the project.
Compatible with all clients, no image weight.

## Home page (`/`)

```
+----------------------------------------------------------+
| Green Coffee   Coffees | Approach | Log in | Sign up     |
+----------------------------------------------------------+
|                                                          |
|  COFFEE, SIMPLY                                          |
|  Lean encyclopedia of coffees from around the world.     |
|  [Browse the 10 coffees]                                 |
|                                                          |
+----------------------------------------------------------+
| +-----------------------+  +-------------------------+   |
| | Why a website about   |  | Why an eco-designed     |   |
| | coffee                |  | site                    |   |
| | Text...               |  | Text...                 |   |
| +-----------------------+  +-------------------------+   |
+----------------------------------------------------------+
| What you will find here                                  |
| | Botanical varieties.                                   |
| | Processing methods.                                    |
| | Terroirs.                                              |
| | Tasting notes.                                         |
+----------------------------------------------------------+
| TI616 EFREI demo site...                                 |
+----------------------------------------------------------+
```

## Coffee list page (`/coffees`)

```
+----------------------------------------------------------+
| Green Coffee   Coffees | Approach | Log in | Sign up     |
+----------------------------------------------------------+
| COFFEES                                                  |
| 10 coffees in the database.                              |
|                                                          |
| +------------------------------------------------------+ |
| | Variety [All v]  Origin [_________]  [Filter]        | |
| +------------------------------------------------------+ |
|                                                          |
| +-------------------+  +-----------------------------+   |
| | Yirgacheffe       |  | Geisha                      |   |
| | Arabica . Ethiopia|  | Arabica . Panama . Boquete  |   |
| | Floral, jasmine.. |  | Bergamot, orange blossom..  |   |
| +-------------------+  +-----------------------------+   |
|                                                          |
| +-------------------+  +-----------------------------+   |
| | Bourbon Pointu    |  | Kerala Robusta              |   |
| | Arabica . France  |  | Robusta . India . Wayanad   |   |
| +-------------------+  +-----------------------------+   |
|                                                          |
|             [Previous]   Page 1 / 1   [Next]             |
|                                                          |
| (logged in only) [Add a coffee]                          |
+----------------------------------------------------------+
```

## Coffee detail page (`/coffees/:id`)

```
+----------------------------------------------------------+
| Green Coffee   Coffees | Approach | Dashboard | Log out  |
+----------------------------------------------------------+
| [Back to list]                                           |
|                                                          |
| YIRGACHEFFE                                              |
|                                                          |
| Variety   : Arabica                                      |
| Origin    : Ethiopia                                     |
| Region    : Sidamo                                       |
| Process   : Washed                                       |
| Altitude  : 2000 m                                       |
| Notes     : Floral, jasmine, lemon, black tea            |
|                                                          |
| Description                                              |
| Considered one of the finest coffees in the world...     |
|                                                          |
| Added by Admin on 2026-05-04.                            |
|                                                          |
| (owner / admin only)  [Edit]  [Delete]                   |
+----------------------------------------------------------+
```

## Log-in page (`/login`)

```
+----------------------------------------------------------+
| Green Coffee   Coffees | Approach | Log in | Sign up     |
+----------------------------------------------------------+
| LOG IN                                                   |
|                                                          |
| Email *    [____________________________]                |
| Password * [____________________________]                |
| [Log in]                                                 |
|                                                          |
| No account yet? [Sign up].                               |
| Demo: admin@green.coffee / admin1234                     |
+----------------------------------------------------------+
```

## Dashboard (`/dashboard`, auth)

```
+----------------------------------------------------------+
| Green Coffee   Coffees | Approach | Dashboard | Log out  |
+----------------------------------------------------------+
| HELLO ADMIN                                              |
| You are logged in with the role admin.                   |
|                                                          |
| My coffees                                               |
| +-------------------+  +-----------------------------+   |
| | Yirgacheffe       |  | Geisha                      |   |
| | Arabica . Ethiopia|  | Arabica . Panama            |   |
| +-------------------+  +-----------------------------+   |
| ...                                                      |
|                                                          |
| [Add a coffee]                                           |
+----------------------------------------------------------+
```

## Users admin (`/users`, admin only)

```
+----------------------------------------------------------+
| USERS                                                    |
| 2 users.                                                 |
|                                                          |
| +-----+--------------------+--------+-------+----------+ |
| |Email|Name                |Role    |Created|Actions   | |
| +-----+--------------------+--------+-------+----------+ |
| |adm..|Admin               |admin   |05-04  |[Edit]    | |
| |usr..|Demo User           |user    |05-04  |[Edit][D] | |
| +-----+--------------------+--------+-------+----------+ |
|                                                          |
| [Add a user]                                             |
+----------------------------------------------------------+
```

## Design principles

- Generous spacing, no decoration without function.
- Single accent colour (green tone, deep in light mode, soft in dark mode).
- 1.5 line-height for readability.
- Min contrast ratio 4.5:1 (verified with WebAIM contrast checker).
- Single navigation, no breadcrumbs (depth max = 2 levels).
- Forms aligned vertically, labels above fields.
- Confirmation before destructive actions (`confirm()`).
