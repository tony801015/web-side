#!/bin/bash
if [ -x "$(command -v docker)" ]; then
    if (! docker stats --no-stream ); then
        while (! docker stats --no-stream ); do
            echo "Waiting for Docker to launch..."
            sleep 1
        done
    fi

    if [ ! "$(docker ps -q -f name=redis-server)" ]; then
        docker run -p 6379:6379 -d --name redis-server redis:5.0.4-alpine3.9 
    else
        echo 'Have redis-server'
    fi
else
    echo "Please install docker"
fi