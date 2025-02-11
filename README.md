# Index App

[![License](https://img.shields.io/:license-mit-blue.svg)](https://opensource.org/licenses/MIT)

This is the official app frontend of the Index Coop.

## Local development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1.  Make a copy of the env file

```bash
cp .env.default .env.local
```

2. Install all the dependencies

```bash
npm install
```

3. Generate kubb files

```bash
npm run generate
```

4. Start dev mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## New Token Release

- Make sure the token data was added to [tokenlists](https://github.com/IndexCoop/tokenlists)
- If possible avoid and use tokenlists utils directly: add token in [tokens.ts](src/constants/tokens.ts) - using tokenlists (check ETH2X for reference)

## New Presale

- Make sure the token data was added to [tokenlists](https://github.com/IndexCoop/tokenlists)
- Add logo in [assets](public/assets) - as defined in tokenlists
- Update tokenlists dependency
- Add token in [tokens.ts](src/constants/tokens.ts)
- Add presale config in [src/app/presales/constants.ts](src/app/presales/constants.ts) and update `getTokenForPresaleToken`
- Test locally w/ hardhat

## Testing

### Unit tests

Run unit tests in watch mode

```bash
npm run test:watch
```

## Contributing

The main purpose of this repository is to continually serve the needs of Index, making it faster, simpler, and easier to use. As new proposals are submitted and the scope of Index's governance evolves, we anticipate this tool will change as well.

We greatly encourage any community contribution that may help Index reach more users and promote greater adoption, so be sure to check out our [Contribution Guidelines](https://github.com/IndexCoop/index-app/blob/master/CONTRIBUTING.md) for ways to get involved with our project.
