import express from 'express';

import accountResource from './resources/account.resource';
import loginResource from './resources/login.resource';
import infoResource from './resources/info.resource';
import authResource from './resources/auth.resource';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/ExempleService/ws/v1/accounts', accountResource);
app.use('/ExempleService/actuator/info', infoResource);
app.use('/ExempleService/ws/v1/logins', loginResource);
app.use('/ExempleAuthorization', authResource);

const port = process.env.PORT || 3000;
app.listen((port), () => {
    console.log(`Server is Running on port ${port}!`);
});

export default app;