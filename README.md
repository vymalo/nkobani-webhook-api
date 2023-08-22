# Nkobani Webhook API

[![Build and Release](https://github.com/vymalo/nkobani-webhook-api/actions/workflows/ci.yml/badge.svg)](https://github.com/vymalo/nkobani-webhook-api/actions/workflows/ci.yml)
[![Build](https://github.com/vymalo/nkobani-webhook-api/actions/workflows/build.yml/badge.svg)](https://github.com/vymalo/nkobani-webhook-api/actions/workflows/build.yml)

This server is meant to receive webhooks from the Nkobani API and process them. "Processing" entails:
- [ ] Sending a welcome email to the user
- [x] Updating hasura with the user's details
