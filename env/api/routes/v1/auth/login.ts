import { RequestHandler } from "express";

interface LoginRequestBody {
    email: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

export const post: RequestHandler = async (req, res) => {
    const { headers: { 'x-scenario': scenario } } = req;
    const { email } = req.body as LoginRequestBody;

    if (scenario === 'http400') {
        res.status(400);
        res.json({ message: 'Invalid request' });
        return;
    }

    if (!email) {
        res.status(400);
        res.json({ message: 'Email is required' });
        return;
    }

    // Mock successful login response
    const response: LoginResponse = {
        token: `mock_token_${Date.now()}`,
        user: {
            id: `user_${Math.random().toString(36).substr(2, 9)}`,
            email: email,
        },
    };

    res.json(response);
}