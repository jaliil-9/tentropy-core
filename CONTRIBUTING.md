# Contributing to TENTROPY

First off, thanks for taking the time to contribute!

The following is a set of guidelines for contributing to TENTROPY. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 📚 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript/TypeScript Styleguide](#javascripttypescript-styleguide)
- [Additional Notes](#additional-notes)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project team.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for TENTROPY. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps to reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for TENTROPY, including completely new features and minor improvements to existing functionality.

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Explain why this enhancement would be useful** to most TENTROPY users.

### Your First Code Contribution

Unsure where to begin contributing to TENTROPY? You can start by looking through these `good-first-issue` and `help-wanted` issues:

- [Good First Issues](https://github.com/jaliil-9/tentropy-core/labels/good%20first%20issue) - issues which should only require a few lines of code, and a test or two.
- [Help Wanted](https://github.com/jaliil-9/tentropy-core/labels/help%20wanted) - issues which should be a bit more involved than `good first issue`.

### Pull Requests

The process described here has several goals:

- Maintain TENTROPY's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible TENTROPY

Please follow these steps to have your contribution considered by the maintainers:

1.  Follow all instructions in [the template](.github/PULL_REQUEST_TEMPLATE.md) (if available).
2.  Follow the [styleguides](#styleguides).
3.  After you submit your pull request, verify that all status checks are passing.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript/TypeScript Styleguide

- We use [TypeScript](https://www.typescriptlang.org/) for type safety.
- We use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to maintain code quality and consistent formatting.
- Please ensure your code passes linting before submitting a PR:
    ```bash
    npm run lint
    ```

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

- `bug` - Issues that are bugs.
- `enhancement` - Issues that are feature requests.
- `documentation` - Issues or PRs related to documentation.
- `good first issue` - Good for newcomers.
