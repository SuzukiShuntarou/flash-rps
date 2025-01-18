#!/usr/bin/env node

import RpsCommandLine from "../src/rpsCommandLine.js";

const cli = new RpsCommandLine();
await cli.startRps();
