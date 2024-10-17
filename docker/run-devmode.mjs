#!/usr/bin/env node

import { execSync } from 'child_process';

// TODO: remove after solving https://github.com/aeternity/ae_mdw/issues/1758
try {
  execSync(
    'docker compose exec middleware ./bin/ae_mdw rpc ":aeplugin_dev_mode_app.start_unlink()"',
    { stdio: 'pipe' },
  );
} catch (error) {
  if (!error.message.includes('{:error, {:already_started')) throw error;
}
