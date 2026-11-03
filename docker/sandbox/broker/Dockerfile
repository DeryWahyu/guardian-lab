FROM node:22-alpine
WORKDIR /broker
COPY docker/sandbox/broker/package*.json ./
RUN npm ci --omit=dev
COPY docker/sandbox/broker/*.mjs ./
EXPOSE 4010 4011
CMD ["node", "server.mjs"]
