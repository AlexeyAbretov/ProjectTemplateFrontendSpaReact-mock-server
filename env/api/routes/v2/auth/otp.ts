import { RequestHandler } from "express";

export const post: RequestHandler = async (req, res) => {
    const { headers: { 'x-scenario': scenario } } = req;

    if (scenario === 'http400') {
        res.status(400);
        res.send();
        return;
    }

    res.json();
}