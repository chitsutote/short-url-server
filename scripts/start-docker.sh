#!/bin/bash
env $(cat env/local.env) docker-compose -f docker-compose.local.yml up -d