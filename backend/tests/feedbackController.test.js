import { jest } from '@jest/globals';

// --- MOCKS ---

const mockFeedbackCreate = jest.fn();
const mockFeedbackFindOne = jest.fn();
const mockFeedbackFind = jest.fn();

jest.unstable_mockModule('../src/models/Feedback.js', () => ({
    default: {
        create: mockFeedbackCreate,
        findOne: mockFeedbackFindOne,
        find: mockFeedbackFind
    }
}));

const mockSessionFindById = jest.fn();
jest.unstable_mockModule('../src/models/Session.js', () => ({
    default: {
        findById: mockSessionFindById
    }
}));

const mockTutorFindOne = jest.fn();
const mockTutorSave = jest.fn();
jest.unstable_mockModule('../src/models/Tutor.js', () => ({
    default: {
        findOne: mockTutorFindOne
    }
}));

// Import Controller
const { createFeedback } = await import('../src/controllers/feedbackController.js');

// Mock helpers
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Feedback Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('SUCCESS: Creates feedback and updates tutor rating', async () => {
        const req = { 
            body: { sessionId: 'sess_1', rating: 5, comment: 'Great!' },
            user: { _id: 'student_1' }
        };
        const res = mockRes();

        // 1. Session is DONE and belongs to user
        mockSessionFindById.mockResolvedValue({
            _id: 'sess_1',
            status: 'done',
            createdByTuteeId: 'student_1',
            tutorId: 'tutor_user_1'
        });

        // 2. No Duplicate
        mockFeedbackFindOne.mockResolvedValue(null);

        // 3. Create Feedback
        mockFeedbackCreate.mockResolvedValue({ _id: 'feed_1', rating: 5 });

        // 4. Update Tutor
        const mockTutor = { save: mockTutorSave, rating: 0, ratingCount: 0 };
        mockTutorFindOne.mockResolvedValue(mockTutor);
        
        // Mock finding ALL feedback (this one + previous)
        // Let's say this is the first one
        mockFeedbackFind.mockResolvedValue([{ rating: 5 }]);

        await createFeedback(req, res);

        expect(mockFeedbackCreate).toHaveBeenCalled();
        expect(mockTutorFindOne).toHaveBeenCalledWith({ userId: 'tutor_user_1' });
        // Rating should be 5
        expect(mockTutor.rating).toBe(5);
        expect(mockTutor.ratingCount).toBe(1);
        expect(mockTutorSave).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('FAIL: Session not done', async () => {
        const req = { body: { sessionId: 'sess_pending' }, user: { _id: 'student_1' } };
        const res = mockRes();

        mockSessionFindById.mockResolvedValue({
            status: 'pending',
            createdByTuteeId: 'student_1'
        });

        await createFeedback(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockFeedbackCreate).not.toHaveBeenCalled();
    });

    it('FAIL: User is not the tutee', async () => {
        const req = { body: { sessionId: 'sess_1' }, user: { _id: 'hacker' } };
        const res = mockRes();

        mockSessionFindById.mockResolvedValue({
            status: 'done',
            createdByTuteeId: 'student_1' // Not hacker
        });

        await createFeedback(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });
});
