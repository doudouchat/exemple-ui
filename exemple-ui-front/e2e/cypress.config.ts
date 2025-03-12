import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'

import * as cassandra from 'cassandra-driver';
import { forkJoin } from 'rxjs';

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1:9042'],
  localDataCenter: 'datacenter1'
});

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on('file:preprocessor', createBundler({
    plugins: [createEsbuildPlugin(config)]
  }));

  on('task', {
    deleteLogin(username: string) {
      return client.execute('delete from test_authorization.login where username = ?', [username]);
    },
    insertLogin(username: string) {
      return client.execute('insert into test_authorization.login (username) values (?)', [username]);
    },
    deleteAccountUsername(username: string) {
      return client.execute('select id from test_service.account_username where username = ? and field = ?', [username, 'email']).then(rows => {
        const row = rows.first();
        if (row) {
          const id = row['id'];
          return forkJoin(
            client.execute('delete from test_service.account_username where username = ? and field = ?', [username, 'email']),
            client.execute('delete from test_service.account where id = ?', [id])
          );
        } else {
          return null;
        }
      });
    },
    insertPassword(username: string) {
      return client.execute('insert into test_authorization.login (username, password) values (?, ?)', [username,
        '{bcrypt}$2a$10$Kd7BZwLmFIfoYDttqaJ6V.Lsp4xe31Qc9ha/gBYFGYgnAMvY758vm']);
    },
    shutdown() {
      return client.shutdown().then(() => { return null; });
    }
  });

  return config;
}

export default defineConfig({
  e2e: {
    specPattern: '**/*.feature',
    baseUrl: 'http://localhost:4200',
    setupNodeEvents,
  },
});
