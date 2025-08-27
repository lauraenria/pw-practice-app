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
npm install --force
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


### Other terminal installation

```bash
npm init
```

### install playright

```bash
npm init playright@latest
or
npm install -D @playwright/test
```
choose typescript