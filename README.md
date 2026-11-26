# Project Template

This repository is a starting point for a project. Fill in your own case, produce the analysis/design products, and build the implementation — all tracked through GitHub issues and pull requests.

## Getting started

1. Create your own repository from this template.
2. Describe your case in [assignment/assignment.md](assignment/assignment.md) and add your stakeholder interviews to [assignment/interviews.md](assignment/interviews.md). Both files contain placeholders (`[...]`) to replace.
3. Read [ISSUES_CREATION.md](ISSUES_CREATION.md) and open your first issues.

## Folders

1. [assignment/](assignment/) — the case brief and interview material (templates to fill in)
2. [products/](products/) — your analysis/design deliverables (persona, diagrams, specs, prototype, test plan)
3. [code/](code/) — the implementation

Project planning and team agreements are maintained in the [GitHub wiki](https://github.com/Immanuel-Cairo/gifts4u-control-tower/wiki). See the [branching model](https://github.com/Immanuel-Cairo/gifts4u-control-tower/wiki/Branchingmodel) and [CI/CD pipeline](https://github.com/Immanuel-Cairo/gifts4u-control-tower/wiki/CI-CD-pipeline) for the current workflow. Analysis/design deliverables remain in `products/`.

## Process

All work — analysis/design products and code alike — must be tracked through GitHub issues and resolved through pull requests. This is not optional: it's how you and your teammates stay able to follow what changed, why, and who reviewed it.

1. **Every piece of work starts as an issue.** Before you touch `products/` or `code/`, open an issue using one of the templates under **Issues → New issue**:
   - **Product Issue** — for analysis/design work (persona, diagrams, specs, prototype, UXD test plan, ...). One issue per deliverable, or per slice of a deliverable — see [ISSUES_CREATION.md](ISSUES_CREATION.md), Part A.
   - **Coding Issue** — for implementation work. One issue per acceptance criterion (vertical slice), or per sequence-diagram step/branch for cross-cutting concerns — see [ISSUES_CREATION.md](ISSUES_CREATION.md), Part B.

   Read [ISSUES_CREATION.md](ISSUES_CREATION.md) before opening issues — it explains how to split a story or product into issues that are small enough to review in one PR, and the size checks both templates ask you to confirm.

2. **Use `develop` and `release`; no direct pushes.** `develop` is the default integration branch. Feature and ordinary bug branches start from and merge into `develop`. Release PRs go from `develop` to `release`. Urgent fixes to the release candidate start from `release`, merge back into `release`, and are then merged back into `develop`. Both fixed branches require a pull request. This development workflow ends at `release`. `master` is the final production branch; promotion to production is outside the scope of this workflow.

3. **One issue → one branch → one pull request.** Use `feature/us-name`, `bugs/short-description`, or `hotfix/short-description`, with lowercase letters and hyphens. Include the story or issue in the name, for example `feature/us-dhl-02-80-specificatie`. This also applies to product documents. Reference the issue with `Closes #<issue-number>` in the PR to `develop`; a hotfix PR only to `release` does not close it automatically. Existing workbranches may retain their old names until that work is finished.

4. **Every pull request gets reviewed before merging.** At least one teammate must approve; review conversations must be resolved and the required `ci (printz-service)` check must pass. Branch protection enforces this for `develop` and `release`, including administrators. New commits require renewed approval. Do not merge your own PR without a review. Use merge commits between the two fixed branches to preserve shared history.

5. **Traceability is the point.** Because every change is: issue → branch → PR → review → merge, anyone (a teammate or us) can look at the issue tracker and reconstruct what was built, in what order, and who signed off on it. Skipping the process breaks that chain — it's the first thing we check when a milestone looks unclear.

The CI workflow runs on pushes and pull requests and currently checks only Printz: dependency installation, lint, build and tests. A green check does not establish that every service works or that a deployment took place. See the wiki for failure handling, release steps and remaining pipeline work.

## Case

See [assignment/assignment.md](assignment/assignment.md) for the case brief and [assignment/interviews.md](assignment/interviews.md) for the interview material it's based on.

## Products

See [products/products.md](products/products.md) for the list of analysis/design deliverables you need to produce, and [ISSUES_CREATION.md](ISSUES_CREATION.md) for how to turn each one into issues.

## Code

- [code/backend/](code/backend/) — an **example** microservice backend (auth service, catalog service and API gateway). It shows the expected setup and conventions; adapt, rename or replace the services to fit your own case. See [code/backend/README.md](code/backend/README.md) for how to run it.
- [code/frontend/](code/frontend/) — empty; add your frontend here.
