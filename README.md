# King of Cardboard Ecommerce Website
This repository contains a previously private ecommerce project for a sports card business that is now closed. The application is built in NextJS, Typescript and Redux plus other packages. NextAuth handles the authentication with a middleware connector to MongoDB which also stores other system data.

Contentful acts as a headless CMS for the website portion of the application, DaisyUI & Tailwind form the styling solution and a custom admin panel supplies editing options for things like orders and system settings. Products are created and edited purely between the web app and the database with no contentful involvement, as such an S3 bucket is used to store product images.

PayPal and Stripe both form the payment gateways as different options for the user. Once an order has been placed, email distribution for situations such as order confirmation is handled with SendGrid.

Vercel acts as a hosting platform primarily chosen for the ease of integrtion between itself and NextJS.

Finally, tracking is turned on or off depending on the user's response to the GDPR popup but if on supports Google Analytics and Meta Analytics, a lot of sales and marketing were performed via Instagram so Meta Analytics for business were helpful in the success of the site. 

## Getting Started

### Environment Variables

To begin, copy `.env.example` to a new file called `.env` in the root of the project and begin going to each service labelled, creating API keys and adding them there and to your Vercel environment.

### Development

This project uses Yarn classic as its package manager but could easily be updated with your package manager of choice. In this project the `yarn` command is used to run scripts out of the box.

```bash
yarn dev
```

### Build

To build a production version of the application, run the build script.

```bash
yarn build
```

To serve the build run the start script.

```bash
yarn start
```

## Lessons Learnt

### Keep up with trends

During the development of the project it was initially conceived as a box "breaking" web app for the UK sports card community. Part way through the development the American collectables platform Whatnot was launched in the UK and adopted by large chunks of the community for box breaking, including myself. Not keeping up with rumours around this platform and underestimating its pull probably could have saved me a tremendous amount of effort a year prior to launch.

### Shift Redux priority to edge cases

Early on in development I chose to rely on Redux for a lot of local data storage that largely ended up being unnecessary. NextJS also requires a special wrapper for Redux to allow it to function properly with SSR. I didn't set this up correctly initially and it caused a tremendous amount of indexing issues on search, that is to say it didn't at all because I didn't fully understand the interaction. Finally, at the time of development towards the end of the app's lifecycle, Next's new app router and Redux didn't work together correctly which blocked an upgrade.

### Tailwind isn't for everyone

Looking to move away from my usual component library of Material UI and its corporate look I chose DaisyUI as my replacement with its underlying tech as Tailwind CSS. DaisyUI was raw but had a nice visual look and simplicity to it, I knew I'd have to make customisations but I didn't know how cluttered inline CSS class assignments would get, especially in flex components. I prefer my code as thin as possible and would likely avoid Tailwind based component libs in future and either go back to Material or pick Chakra back up.

### Focus on architecture

NextJS is great and has a lot of good features but my over reliance on Vercel's integration with it caused the performance and stability to suffer. When I started looking into React Native applications as well I realised I couldn't access the API built into Next. For my next build I'll likely look into a NestJS microservice build for the API, work more on a custom CI pipeline, utilise an AWS service for hosting and only rely on a meta framework for things like SSR functionality.