### Testing Strategy

In senior frontend interviews, testing questions are not about “whether you can write `expect`”, but about:

- how you split testing layers
- how you decide what is worth testing
- how you keep the test system from slowing delivery

A better way to answer is to treat testing as part of a quality strategy, not a tooling question.

#### 1. Why you need test layering

Different kinds of problems should be found by different layers of tests.

If you expect E2E to catch everything:

- cost is high
- feedback is slow
- failures are hard to locate

If you rely only on unit tests:

- many integration issues are not covered
- UI interaction and real browser behavior are missing

So a more reasonable approach is layering.

#### 2. Common testing layers

##### 2.1 Unit tests

Goals:

- verify pure functions, utilities, and state-transition logic
- fast feedback
- cheap coverage of edge cases

Good for:

- utility functions
- reducers
- data-transform functions
- parts of custom hooks that do not depend on a real DOM

##### 2.2 Component tests

Goals:

- verify how a component behaves in a near-real usage style
- focus on rendering, interaction, state changes, accessibility

Good for:

- form components
- list components
- dialogs
- data-display components

The point is not to test internals, but to test results the user can see and operate.

##### 2.3 Integration tests

Goals:

- verify that multiple modules collaborate correctly
- check behavior after components, state, and the request layer are combined

Good for:

- page-level interactions
- form submit flows
- linkage logic after a route change

##### 2.4 E2E tests

Goals:

- verify key business flows from the user’s perspective
- find integration issues in a real browser environment

Good for:

- login
- placing an order
- search
- pre-payment flows
- permission redirects

E2E should not cover every detail. It should cover the most critical, most failure-sensitive, most cross-layer main paths.

#### 3. A practical test pyramid

A more solid strategy is usually:

- lots of unit tests
- a moderate amount of component / integration tests
- a small number of critical E2E tests

The reason is not dogma, but cost and feedback speed:

- unit tests are cheap and fast
- component tests are closer to real usage
- E2E is slowest but closest to the real environment

#### 4. What is worth testing

Not all code deserves the same testing intensity.

Usually more worth testing:

- logic that easily regresses
- high business-value flows
- modules with complex state combinations
- places that historically caused incidents
- parts with many external dependencies and complex integration boundaries

Usually not worth over-testing:

- purely static pages with almost no logic
- internal behavior a third-party library already guarantees well
- assertions bound too tightly to implementation details

#### 5. How to write tests that survive refactoring

Good tests should focus more on behavior than implementation details.

Wrong direction:

- testing internal state variables
- testing whether a private method was called
- testing how many times a hook was called

A more solid direction:

- how the page changes after user input
- whether a button is clickable
- whether an error message appears
- whether the right request happens after submit

#### 6. The boundary of mocks

Mocks are a necessary tool, but they can be overused.

##### 6.1 What is a good fit to mock

- network requests
- time
- browser APIs
- third-party SDKs

##### 6.2 What is a poor fit to over-mock

- the core logic you actually want to verify
- real collaboration between components
- key user flows

The result of over-mocking is tests that are “all green”, then the real system breaks as soon as it runs.

#### 7. How to look at coverage

Coverage is a reference metric, not the goal itself.

High coverage is not high quality, because:

- assertions may be weak
- critical branches may be untested
- executing the code does not mean verifying the behavior

A better framing:

- use coverage to find obviously untested areas
- do not treat coverage as the only KPI
- care more about whether high-value logic has effective assertions

#### 8. How to handle flaky tests

Unstable tests are one of the things that most damage team trust in a test system.

Common causes:

- depending on time
- depending on the network
- depending on async timing
- depending on globally shared state
- depending on fragile selectors

Common ways to govern them:

- wait for a real visible state, not a blind timeout
- isolate test data
- reduce shared-environment dependencies
- use stable locators
- synchronize more explicitly on async behavior

#### 9. A recommended tool mix for frontend projects

##### 9.1 Unit / component tests

A good fit:

- Vitest
- Testing Library / Vue Test Utils

##### 9.2 E2E

A good fit:

- Playwright

Advantages of this mix:

- fast feedback
- good compatibility with modern frontend build tools
- covers different layers from functions to browser flows

#### 10. How to run tests in CI

Test strategy has to work with the delivery chain, not exist on its own.

A more reasonable CI approach is usually:

1. at the PR stage, run lint, unit tests, component tests, and build verification
2. at the main-branch stage, add critical E2E or smoke tests
3. after release, watch error monitoring and key metrics

Why:

- put fast feedback in front
- put high-cost verification later
- do not let the whole team get stuck on the slowest tests

#### 11. If this repo adds more tests, what to add first

This repo is a better fit to add two kinds of content first:

1. unit tests for hand-written implementations
2. a minimal smoke test for the docs site or key interactions

Highest-priority candidates:

- `hand-write/promise`
- `hand-write/simulate/eventEmitter.js`
- some utility functions and state-transition logic

#### 12. High-frequency interview questions

##### 12.1 How do unit, component, and E2E tests divide work

Unit tests own small logic and edges. Component tests own interaction and render behavior. E2E owns key business paths and real-browser integration issues.

##### 12.2 Why high coverage is not high quality

Because coverage only shows that code was executed. It does not mean key behavior was correctly verified, or that assertions are strong enough.

##### 12.3 Why tests should be layered

Because feedback speed, cost, and locating ability differ by layer. Pushing every problem onto one layer unbalances the quality system.

##### 12.4 What is a good frontend test

It stably finds high-value issues, gives fast feedback, is friendly to refactoring, is loosely coupled to implementation details, and is maintainable on the team.

#### 13. Interview answer suggestions

If you are asked about testing strategy, do not only say “we use Vitest and Playwright”. A more solid structure is:

1. first why you need test layering
2. then what each layer tests and does not test
3. then the trade-offs of mocks, coverage, and flaky tests
4. finally how CI carries the testing strategy

That upgrades the answer from “can write tests” to “can design a quality-assurance system”.
