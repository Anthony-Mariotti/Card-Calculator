# Card Calculator (Work in Progress)

Quickly calculate how much you need to pay off your credit cards each week to reach a zero dollar balance. We don't want to pay that interest! As noted in the title this project is a work in progress so there are going to be a lot of issues. Scroll down to view the list of items that I would like to work on and what has already been implemented.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

You can also use [Visual Studio Code](https://code.visualstudio.com/) and run thea debug session with breakpoints with the configuration `Server/Client`. Make sure to stop both the `Server` and the `Client` when attempting to stop debugging since they both run on independent taks.

You shouldn't need to restart the debug session often as `vite` should handle hot reloading code for you, but it still breaks sometimes 🙂.

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
