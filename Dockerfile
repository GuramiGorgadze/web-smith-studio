# One image that runs everything: the Node mail server, which also serves the built website.
#
#   docker build -t web-smith-studio \
#     --build-arg VITE_SITE_URL=https://your-domain.com \
#     --build-arg VITE_CONTACT_EMAIL=hello@your-domain.com .
#
#   docker run -p 8787:8787 --env-file server/.env -e NODE_ENV=production web-smith-studio
#
# The settings for the server (SMTP login, MAIL_TO ...) are NOT baked into the image: pass them at run time
# with --env-file or -e, or through your host's "environment variables" page. See server/.env.example.

# 1. Build the website. The contact form posts to the server that serves it, so its address is /api/contact.
FROM node:22-alpine AS site
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_SITE_URL=""
ARG VITE_CONTACT_EMAIL=""
ENV VITE_FORM_ENDPOINT=/api/contact \
    VITE_SITE_URL=$VITE_SITE_URL \
    VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL
RUN npm run build

# 2. Install only what the server needs to run (no test tools).
FROM node:22-alpine AS server-deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# 3. The image that runs.
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY server/package.json ./server/package.json
COPY server/src ./server/src
COPY server/assets ./server/assets
COPY --from=site /app/dist ./dist

USER node
WORKDIR /app/server
EXPOSE 8787

# Healthy when the API answers. The server reads PORT, so this follows it if your host changes it.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-8787}/api/health" > /dev/null || exit 1

CMD ["node", "src/index.js"]
