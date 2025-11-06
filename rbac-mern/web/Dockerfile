# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /web
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # produces /web/dist

# --- nginx stage ---
FROM nginx:1.27-alpine
COPY --from=build /web/dist /usr/share/nginx/html
# single-page app fallback
RUN printf "server {\
  listen 80; \
  server_name _; \
  root /usr/share/nginx/html; \
  location / { try_files \$uri /index.html; } \
}" > /etc/nginx/conf.d/default.conf
EXPOSE 80
