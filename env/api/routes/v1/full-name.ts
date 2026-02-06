import { RequestHandler } from "express";

interface FullNameRequestBody {
    lastName: string;
    firstName: string;
    middleName?: string;
}

interface FullNameResponse {
    id: string;
    lastName: string;
    firstName: string;
    middleName?: string;
}

export const post: RequestHandler = async (req, res) => {
    const { headers: { 'x-scenario': scenario } } = req;
    const { lastName, firstName, middleName } = req.body as FullNameRequestBody;

    // Handle different scenarios
    if (scenario === 'http400') {
        res.status(400);
        res.json({ message: 'Invalid request data' });
        return;
    }

    if (scenario === 'http500') {
        res.status(500);
        res.json({ message: 'Internal server error' });
        return;
    }

    // Validate required fields
    if (!lastName || !firstName) {
        res.status(400);
        res.json({ message: 'lastName and firstName are required' });
        return;
    }

    // Mock successful response
    const response: FullNameResponse = {
        id: Math.random().toString(36).substring(2, 9),
        lastName: lastName,
        firstName: firstName,
        middleName: middleName
    };

    res.json(response);
};
