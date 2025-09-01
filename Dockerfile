

# We are following the same structure while building a docker container

# /app
# |-- package.json 
# |-- package-lock.json 
# |-- tsconfig.json
# |-- src/
# |-- app.ts
# |-- index.d.ts

# **************************** BUILDER STAGE **************************** #

# BUILDER STAGE 
FROM node:iron-alpine as builder

# Set Working directory 
WORKDIR /builder-app

# Copy package.json
COPY ./package.json package.json

# Copy package-lock.json
COPY ./package-lock.json package-lock.json

# Install all dependencies
RUN npm install

# Copy Entire folder
COPY . .

# Build project
RUN npm run build

# **************************** RUNNER STAGE **************************** #

# RUNNER STAGE 
FROM node:iron-alpine as runner

# Set Working directory
WORKDIR /app

# Copy  package.json
COPY --from=builder builder-app/package.json package.json

# Copy  build folder
COPY --from=builder builder-app/build build

# Copy node_modules
COPY --from=builder builder-app/node_modules node_modules

#  Run npm install
CMD ["npm", "run", "start"]



# docker build --platform linux/amd64  -t codeusdev/quantam_user_api .

# docker push codeusdev/quantam_user_api

# docker run --env-file ./.env codeusdev/quantam_user_api