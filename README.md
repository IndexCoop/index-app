# Index App

[![License](https://img.shields.io/:license-mit-blue.svg)](https://opensource.org/licenses/MIT)

Index App is a simple front-end used to interact with Index and its products.

## Local development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

1.  Make a copy of the env file

```bash
cp .env.default .env.local
```

1. Install all the dependencies

```bash
npm install
```

1. Start dev mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

### Unit tests

Run unit tests in watch mode

```bash
npm run test
```

## Contributing

The main purpose of this repository is to continually serve the needs of Index, making it faster, simpler, and easier to use. As new proposals are submitted and the scope of Index's governance evolves, we anticipate this tool will change as well.

We greatly encourage any community contribution that may help Index reach more users and promote greater adoption, so be sure to check out our [Contribution Guidelines](https://github.com/IndexCoop/index-app/blob/master/CONTRIBUTING.md) for ways to get involved with our project.

## Style Guide

### Absolute imports

Prefer absolute imports over relative imports because this is a loose codebase convention. Refer to [Configuring React Absolute Imports For TypeScript](https://justinnoel.dev/2019/06/18/configuring-react-absolute-imports-for-typescript/) if your editor isn't picking up absolute imports.

```typescript
// Good
import Page from 'components/Page'

// Bad
import Page from '../../components/Page'
```

### Import ordering

Order library imports at the top of the file, then a newline separator, then imports for exported members that are defined in this package.

```typescript
// Good
import React, { useEffect } from 'react'
import { Container, Spacer } from 'react-neu'

import Page from 'components/Page'
import Explanation from 'components/Explanation'
```

```typescript
// Bad
import React, { useEffect } from 'react'
import Page from 'components/Page'
import { Container, Spacer } from 'react-neu'
import Explanation from 'components/Explanation'
```

## License

Index App is MIT licensed.
