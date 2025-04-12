FROM alpine:3.18
RUN apk add --no-cache mongodb-tools dcron bash && \
    mkdir -p /sync-scripts && \
    mkdir -p /var/spool/cron/crontabs
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]