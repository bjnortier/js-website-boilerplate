# typescript-website-boilerplate

Boilerplate code for setting up a Typescript website (front-end and backend). Main technologies:

1. Typescript
1. Express for the web server
1. Parcel for the front-end bundler
1. React
1. Postgres

## React

The front-end is React. This boilderplate includes the correct route setup when using react-router-dom, i.e. a page /foo is served correctly.

## Heroku

This app is deployed on Heroku and deploys as-is. You only have to do two things:

1. Create the required table in the Postgres Database (see above). You can access the Heoku DB using the command `heroku pg:psql`.
1. Create a LOG_LEVEL environment variable.
