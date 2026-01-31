import { RequestHandler } from "express";

export const get: RequestHandler = async (req, res) => {
    const { headers: { 'x-scenario': scenario } } = req;

    if (scenario === 'http400') {
        res.status(400);
        res.send();
        return;
    }

    res.json([{
        id: 1,
        name: 'name 1'
    },
    {
        id: 2,
        name: 'name 2'
    }]);
}