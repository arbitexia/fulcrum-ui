### FE - Red Vector App

#### How to execute the dev app.

1. Create the file named `.env.development` from the `env.example`

2. Make sure to populate the file on `.env.development` with the following:

```text
HOSTING_URL=http://localhost:3000
SCORING_URL=http://localhost:8500
MODEL_URL=http://localhost:8501
ENTITY_URL=http://localhost:8502
STATS_URL=http://localhost:8503
CONTROL_URL=http://localhost:8504
AUTHENTICATION_URL=http://localhost:8505
CONFIG_URL=http://localhost:8506
SERVICE_NAME=keycloak
```

3. Install the dependencies

```bash
> yarn install
```

4. Start the development server

```bash
> yarn dev
```
