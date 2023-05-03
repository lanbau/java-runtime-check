# java-runtime-check

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t java-runtime-check .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> java-runtime-check
```

## OCI API Keys
- Sign up for a OCI free tier account to get the api keys (Pem file & config file)

## License

[ISC](LICENSE) © 2023 Irvin Lin
