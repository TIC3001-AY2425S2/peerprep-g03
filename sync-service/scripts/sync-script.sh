#!/bin/bash
case $1 in
  user)
    mongodump --host mongo-user --port 27017 -u root -p example --authenticationDatabase admin \
      --db peerPrepDB --archive | \
    mongorestore --host mongo-central --port 27017 -u root -p example --authenticationDatabase admin \
      --archive --nsInclude="peerPrepDB.*" --nsFrom="peerPrepDB." --nsTo="peerPrepDB." --drop
    ;;
  question)
    mongodump --host mongo-question --port 27017 -u root -p example --authenticationDatabase admin \
      --db peerPrepDB --archive | \
    mongorestore --host mongo-central --port 27017 -u root -p example --authenticationDatabase admin \
      --archive --nsInclude="peerPrepDB.*" --nsFrom="peerPrepDB." --nsTo="peerPrepDB." --drop
    ;;
  collab)
    mongodump --host mongo-collab --port 27017 -u root -p example --authenticationDatabase admin \
      --db peerPrepDB --archive | \
    mongorestore --host mongo-central --port 27017 -u root -p example --authenticationDatabase admin \
      --archive --nsInclude="peerPrepDB.*" --nsFrom="peerPrepDB." --nsTo="peerPrepDB." --drop
    ;;
esac
