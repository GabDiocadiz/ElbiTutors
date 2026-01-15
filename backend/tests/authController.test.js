import { jest } from '@jest/globals';

// 1. Mock 'google-auth-library' BEFORE importing the controller
jest.unstable_mockModule('google-auth-library', () => ({
    OAuth2Client: jest.fn().mockImplementation(() => ({
        verifyIdToken: jest.fn().mockImplementation(({ idToken }) => {
            if (idToken === 'valid_token') {
                return Promise.resolve({
                    getPayload: () => ({
                        email: 'test@up.edu.ph',
                        name: 'Test Student',
                        sub: '123456789',
                        picture: 'pic.jpg',
                        hd: 'up.edu.ph'
                    })
                });
            }
            if (idToken === 'invalid_domain') {
                return Promise.resolve({
                    getPayload: () => ({
                        email: 'hacker@gmail.com',
                        name: 'Hacker',
                        sub: '987654321'
                    })
                });
            }
            return Promise.reject(new Error('Invalid Token'));
        })
    }))
}));

// 2. Mock 'User' model
const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();

jest.unstable_mockModule('../src/models/User.js', () => ({
    default: {
        findOne: mockUserFindOne,
        create: mockUserCreate
    }
}));

// 3. Dynamic Import of Controller and User (after mocks are defined)
const { googleLogin } = await import('../src/controllers/authController.js');
const { default: User } = await import('../src/models/User.js');

// Mock helpers
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const mockNext = jest.fn();

describe('Auth Controller - Google Login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test_secret';
        process.env.GOOGLE_CLIENT_ID = 'test_client_id';
        process.env.NODE_ENV = 'test';
    });

    it('should authenticate a valid UP student and return a token', async () => {
        const req = { 
            body: { 
                credential: 'valid_token',
                degree_program: 'BS Computer Science',
                classification: 'Freshman',
                student_number: '2023-12345'
            } 
        };
        const res = mockRes();

        // Setup User mock behavior
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({
            _id: 'new_user_id',
            name: 'Test Student',
            email: 'test@up.edu.ph',
            role: 'tutee',
            picture: 'pic.jpg'
        });

        await googleLogin(req, res, mockNext);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@up.edu.ph' });
        expect(User.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            token: expect.any(String)
        }));
    });

    it('should reject a non-UP email address', async () => {
        const req = { body: { credential: 'invalid_domain' } };
        const res = mockRes();

        await googleLogin(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        const error = mockNext.mock.calls[0][0];
        expect(error.statusCode).toBe(403);
    });
});
