# Versioning System

## Date-Based Version Format
`YYYY-MM-DD.RUN_NUMBER` (e.g. 2024-03-15.1)

### Components:
- **YYYY-MM-DD**: Date of release candidate creation
- **RUN_NUMBER**: Sequential build number for that day

### Release Types:
| Type       | Format              | Example           |
|------------|---------------------|-------------------|
| Nightly    | YYYY-MM-DD.N        | 2024-03-15.1      |
| Beta       | YYYY-MM-DD-bN       | 2024-03-15-b2     |
| Stable     | YYYY-MM-DD          | 2024-03-15        |

### Policy:
- Multiple daily builds append sequential numbers
- Final release uses bare date without build number
- Pre-release tags (-alpha/-beta/-rc) allowed post-date
