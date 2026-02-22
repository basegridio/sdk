# Contributing to @basegrid-io/core

## Setup

```bash
git clone https://github.com/basegrid-io/sdk.git
cd sdk-node
npm install
cp .env.example .env  # Add your BASEGRID_API_KEY
npm run build
```

## Running Tests

```bash
BASEGRID_API_KEY=your_key npm test
```

## Pull Request Guidelines

- Keep changes focused and minimal
- Include tests for new functionality
- Ensure `npm run build` passes
- Update README if adding new methods

## License

By contributing, you agree your contributions will be licensed under Apache 2.0.
