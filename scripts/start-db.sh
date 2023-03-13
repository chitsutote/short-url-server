#!/bin/bash
env $(cat config/local.env) docker-compose -f docker-compose.local.yml up -d