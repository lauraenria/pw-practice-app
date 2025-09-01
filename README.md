## Ngx-Admin Angular 14 application from akveo.com

This is modified and more lightweight version of original application to practice UI Automation with Playwright.

The original repo is here: https://github.com/akveo/ngx-admin


## Installation & Run

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Visual Studio Code](https://code.visualstudio.com/)

### Steps
Clone the repository and move into the project folder:

```bash
git clone <repo-url>
cd <project-folder>
````

Install dependencies and start the application:

```bash
npm init  playwright@latest --force
npm start
CTRL + C to stop the server
```
⚠️ Keep this terminal open and running to keep the application active.

If you need to run other Git or npm commands, open a new terminal instead of stopping the server.

* `npm install --force` → installs all dependencies (forcing if there are conflicts).
* `npm start` → starts the application.

### Access the App

Once the server is running, open your browser and go to:

👉 [http://localhost:4200](http://localhost:4200)



###  playright commands

Inside that directory, you can run several commands:

  `npx playwright test`
    Runs the end-to-end tests.

  `npx playwright test --ui`
    Starts the interactive UI mode.

  `npx playwright test --project=chromium`
    Runs the tests only on Desktop Chrome.

  `npx playwright test example`
    Runs the tests in a specific file.

  `npx playwright test --debug`
    Runs the tests in debug mode.

  `npx playwright codegen`
    Auto generate tests with Codegen.

We suggest that you begin by typing:

```bash
    npx playwright test
```

And check out the following files:
  - .\tests\example.spec.ts - Example end-to-end test
  - .\tests-examples\demo-todo-app.spec.ts - Demo Todo App end-to-end tests
  - .\playwright.config.ts - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information. ✨