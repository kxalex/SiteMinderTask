FROM node:10.16.3-alpine

ENV APPDIR=/app/

WORKDIR $APPDIR

ADD . $APPDIR

#RUN apk --update add --no-cache curl --virtual dep-build python make g++ && \
#    yarn install  && \
#    apk del dep-build && \
#     rm -rf /var/cache/apk/*
RUN yarn install

EXPOSE 3000

CMD ["node", "index.js"]