const nock = require('nock');

const mock = () => {
  nock('https://localise.biz/api')
    .persist()

    .get('/auth/verify')
    .reply(200, {
      user: {
        id: 12345,
        name: 'Rodrigo Gomes da Silva',
        email: 'rodrigo.gomes@involves.com.br',
      },
      group: {
        id: 12345,
        name: 'group',
      },
      project: {
        id: 12345,
        name: 'Test Project',
        url: 'https://localise.biz/dashboard/project/view/12345',
      },
    })

    .get('/locales')
    .reply(200, [
      {
        code: 'pt',
        name: 'Portuguese',
        native: false,
        plurals: {
          length: 2,
          equation: 'n != 1',
          forms: [
            'one',
            'other',
          ],
        },
        progress: {
          translated: 2783,
          untranslated: 41,
          flagged: 2,
        },
      },
      {
        code: 'en',
        name: 'English',
        native: false,
        plurals: {
          length: 2,
          equation: 'n != 1',
          forms: [
            'one',
            'other',
          ],
        },
        progress: {
          translated: 2683,
          untranslated: 141,
          flagged: 2,
        },
      },
    ])

    .get('/assets')
    .reply(200, [
      {
        id: 'action.nopermission',
        type: 'text',
        name: 'Usuário não possui permissões para realizar esta ação.',
        context: '',
        notes: '',
        modified: '2017-07-12 14:48:13 +0000',
        plurals: 0,
        tags: [],
        progress: {
          translated: 3,
          untranslated: 0,
          flagged: 0,
        },
      },
      {
        id: 'login.wrongcredentials',
        type: 'text',
        name: 'Login do usuário ou senha inválido.',
        context: '',
        notes: 'login',
        modified: '2017-07-12 14:48:13 +0000',
        plurals: 0,
        tags: [],
        progress: {
          translated: 3,
          untranslated: 0,
          flagged: 0,
        },
      },
    ])

    .post('/translations/:term/:locale')
    .reply(200, {})

    .post('/translations/:term/:locale/flag')
    .reply(200, {});
};

const clean = () => {
  nock.cleanAll();
};

module.exports = {
  mock,
  clean,
};
