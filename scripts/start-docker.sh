#!/bin/bash
env $(cat env/.env.local) docker-compose -f docker-compose.local.yml up -d