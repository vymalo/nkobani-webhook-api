# ---- Base Stage ----
FROM node:20 AS base
WORKDIR /app
# Installing pnpm globally in the container
RUN npm install -g pnpm
# Copy just the pnpm files
COPY package.json pnpm-lock.yaml ./

# ---- Dependencies Stage ----
FROM base AS proddependencies
# Install only the production dependencies
RUN pnpm install --prod

# ---- Build Dependencies Stage ----
FROM base AS builddependencies
# Install ALL node_modules, including 'devDependencies'
RUN pnpm install

# ---- Build Stage ----
FROM builddependencies AS build
# Now, copy everything and build
# The order ensures that if only source code changes, only this stage and the stages after it are rebuilt
COPY . .
RUN pnpm run build

# ---- Release Stage ----
FROM node:20-alpine AS release

LABEL maintainer="Stephane, Segning Lambou <selastlambou@gmail.com>"

ENV PORT=3000
ENV NODE_ENV=production

ARG REDIS_URL
ARG RABBITMQ_URI
ARG RABBITMQ_QUEUE_NAME

ARG KEYCLOAK_URL
ARG KEYCLOAK_REALM

ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET

ARG HASURA_GRAPHQL_ENDPOINT
ARG HASURA_GRAPHQL_ADMIN_SECRET

WORKDIR /app
# Copy built app from build stage
COPY --from=build /app/dist ./dist
# Copy production node_modules from dependencies stage
COPY --from=proddependencies /app/node_modules ./node_modules
# Expose port 3000 (change if your app uses a different port)
EXPOSE 3000
CMD ["node", "dist/main"]
