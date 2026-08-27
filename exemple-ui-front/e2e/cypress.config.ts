import axios from 'axios';
import crypto from 'crypto';
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
  const isStub = !!config.expose.stub;
  if (isStub) {
    console.log('back is a stub!');
  }
  on('file:preprocessor', createBundler({
    plugins: [createEsbuildPlugin(config)]
  }));

  on('task', {
    deleteAuth(username: string) {
      if (isStub) {
        return axios
          .delete('http://localhost:8086/ExempleAuthorization/ws/v1/logins/' + username)
          .then(res => { return res.data; });
      }
      return client.execute('delete from test_authorization.login where username = ?', [username]);
    },
    createUsername(username: string) {
      if (isStub) {
        return axios
          .post('http://localhost:8086/ExempleService/ws/v1/logins', { 'username': username })
          .then(res => { return res.data; });
      }
      return client.execute('insert into test_service.account_username (id, username, field) values (?, ?, ?)', [crypto.randomUUID(), username, 'email']);
    },
    deleteAccount(username: string) {
      if (isStub) {
        return axios
          .delete('http://localhost:8086/ExempleService/ws/v1/accounts/' + username)
          .then(res => { return res.data; });
      }
      return client.execute('select id from test_service.account_username where username = ? and field = ?', [username, 'email']).then(rows => {
        const row = rows.first();
        if (row) {
          const id = row['id'];
          return forkJoin([
            client.execute('delete from test_service.account_username where username = ? and field = ?', [username, 'email']),
            client.execute('delete from test_service.account where id = ?', [id])
          ]);
        } else {
          return null;
        }
      });
    },
    createAuth(username: string) {
      if (isStub) {
        return axios
          .put('http://localhost:8086/ExempleAuthorization/ws/v1/logins/' + username, { 'password': '123' })
          .then(res => { return res.data; });
      }
      return client.execute('insert into test_authorization.login (username, password) values (?, ?)', [username,
        '{bcrypt}$2a$10$Kd7BZwLmFIfoYDttqaJ6V.Lsp4xe31Qc9ha/gBYFGYgnAMvY758vm']);
    },
    shutdown() {
      if (isStub) {
        return null;
      }
      return client.shutdown().then(() => { return null; });
    }
  });

  return config;
}

export default defineConfig({
  expose: {
    stub: false
  },
  e2e: {
    specPattern: '**/*.feature',
    baseUrl: 'http://localhost:4200',
    setupNodeEvents
  },
  allowCypressEnv: false
});
