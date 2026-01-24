import { resolve } from 'path';
import express, { type Application } from 'express';
import { readdirSync } from 'fs';

const readRoutes = (app: Application, path: string, routePrefix: string[] = []) => {
    const dirs = readdirSync(path, { encoding: 'utf-8', withFileTypes: true });

    for (const item of dirs) {
        if (item.isDirectory()) {
            readRoutes(app, resolve(path, item.name), [...routePrefix, item.name]);
            continue;
        }

        const parts = item.name.match(/(?<name>.+)\.[tj]s$/);

        if (parts) {
            const name = parts.groups.name;

            console.log('Found routes module - ', name);

            try {
                const module = require(resolve(path, name));

                for (const [method, handler] of Object.entries(module)) {
                    const pathName = '/' + [...routePrefix, name].join('/');
                    const realMethod = method === 'del' ? 'delete' : method;

                    app[realMethod](pathName, handler);

                    console.error('Start listen - ', realMethod.toUpperCase(), pathName);
                }
            } catch (e) {
                console.error('Cannot load routes module - ', name, e);
            }
        }
    }
}

const init = () => {
    const envs: string[] = [];
    const dirs = readdirSync(resolve(__dirname, 'env'), { encoding: 'utf-8', withFileTypes: true });

    for (const item of dirs) {
        if (item.isDirectory()) {
            envs.push(item.name);
        }
    }

    console.log('Found envs - ', envs);

    for (const env of envs) {
        console.log('Initiate env - ', env);

        const envPath = resolve(__dirname, 'env', env);
        const config = {
            port: 9001,
            routePrefix: '',
            ...require(resolve(envPath, 'config')).default
        }

        console.log('Found config - ', env, config);

        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.listen(config.port);

        readRoutes(app, resolve(envPath, 'routes'), config.routePrefix.split('/').filter(x => x));
    }
}

init();
