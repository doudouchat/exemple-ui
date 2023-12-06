ARG VERSION_NODE
ARG VERSION_NGINX
FROM node:$VERSION_NODE as build
WORKDIR exemple-ui
COPY exemple-ui-front/package.json ./
COPY exemple-ui-front/package-lock.json .
RUN npm ci
RUN rm -rf node_modules/@types/long
RUN  echo $(ls)
COPY exemple-ui-front/src ./src
COPY exemple-ui-front/*.json ./
COPY exemple-ui-front/*.js ./
RUN npm run-script build

FROM nginx:$VERSION_NGINX
RUN mkdir /exemple-ui
COPY --from=build /exemple-ui/dist/exemple-ui/ /exemple-ui
COPY conf/nginx.conf /etc/nginx/nginx.conf