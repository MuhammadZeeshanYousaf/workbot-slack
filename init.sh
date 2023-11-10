#!/bin/sh

if [ "$APP_ENV" = "dev" ]; then
  # Run the development command
  exec npm run dev
elif [ "$APP_ENV" = "prod" ]; then
  # Run the production command
  exec npm start
else
  echo "Unsupported APP_ENV: $APP_ENV"
  exit 1
fi
