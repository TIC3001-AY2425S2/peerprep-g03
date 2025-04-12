#!/bin/sh
cp /sync-scripts/sync-cronjob /etc/cron.d/
chmod 0644 /etc/cron.d/sync-cronjob
crond -f
