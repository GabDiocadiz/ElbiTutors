import { jest } from '@jest/globals';

// --- MOCKS ---

// 1. Mock Report Model
const mockReportCount = jest.fn();
jest.unstable_mockModule('../src/models/Report.js', () => ({
    default: {
        countDocuments: mockReportCount
    }
}));

// 2. Mock User Model
const mockUserCount = jest.fn();
jest.unstable_mockModule('../src/models/User.js', () => ({
    default: {
        countDocuments: mockUserCount
    }
}));

// 3. Mock Tutor Model (New dependency for fix)
const mockTutorFindOne = jest.fn();
jest.unstable_mockModule('../src/models/Tutor.js', () => ({
    default: {
        findOne: mockTutorFindOne
    }
}));

// 4. Mock Session Model
// Need to mock findById and save() for the new logic
const mockSessionFindById = jest.fn();
jest.unstable_mockModule('../src/models/Session.js', () => ({
    default: {
        findById: mockSessionFindById
    }
}));

// 5. Mock TutorProfile Model
const mockTutorProfileUpdate = jest.fn();
jest.unstable_mockModule('../src/models/TutorProfile.js', () => ({
    default: {
        findOneAndUpdate: mockTutorProfileUpdate
    }
}));

// Dynamic Imports (must happen after mockModule)
const { getDashboardStats } = await import('../src/controllers/adminController.js');
const { completeSession } = await import('../src/controllers/sessionController.js');
const { updateAvailability } = await import('../src/controllers/userController.js');

// Helper Mocks
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Gavin Updates Branch - Fix Verification', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Admin Controller - Get Dashboard Stats', () => {
        it('SUCCESS: Queries Reports with lowercase "pending"', async () => {
            const req = {};
            const res = mockRes();

            mockUserCount.mockResolvedValue(5);
            mockReportCount.mockResolvedValue(2);

            await getDashboardStats(req, res);

            // Verified Fix: 'pending' (lowercase)
            expect(mockReportCount).toHaveBeenCalledWith({ status: 'pending' });
            expect(res.json).toHaveBeenCalledWith({ totalTutors: 5, unresolvedReports: 2 });
        });
    });

    describe('User Controller - Update Availability', () => {
        it('SUCCESS: Finds Tutor by userId first, then updates Profile by tutorId', async () => {
            const req = { 
                user: { _id: 'user_123' },
                body: { availability: ['Mon 9-5'] }
            };
            const res = mockRes();

            // Mock Tutor Lookup Success
            mockTutorFindOne.mockResolvedValue({ _id: 'tutor_999' });
            
            // Mock Profile Update Success
            mockTutorProfileUpdate.mockResolvedValue({ availability: ['Mon 9-5'] });

            await updateAvailability(req, res);

            // Verified Fix: 
            // 1. Look up Tutor via userId
            expect(mockTutorFindOne).toHaveBeenCalledWith({ userId: 'user_123' });
            
            // 2. Update Profile via tutorId (NOT userId)
            expect(mockTutorProfileUpdate).toHaveBeenCalledWith(
                expect.objectContaining({ tutorId: 'tutor_999' }),
                expect.anything(),
                expect.anything()
            );
            
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    
    describe('Session Controller - Complete Session', () => {
        it('SUCCESS: Allows update if user is the Tutor', async () => {
            const req = { 
                params: { id: 'session_abc' },
                user: { _id: 'tutor_555' }
            };
            const res = mockRes();

            // Mock Session: User IS the tutor
            const mockSession = { 
                _id: 'session_abc', 
                tutorId: 'tutor_555', 
                createdByTuteeId: 'student_777',
                save: jest.fn() 
            };
            mockSessionFindById.mockResolvedValue(mockSession);

            await completeSession(req, res);

            // Verified Fix: Check ownership
            expect(mockSessionFindById).toHaveBeenCalledWith('session_abc');
            expect(mockSession.status).toBe('done');
            expect(mockSession.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });

        it('SECURITY: Rejects update if user is NOT the owner', async () => {
             const req = { 
                params: { id: 'session_abc' },
                user: { _id: 'random_hacker' }
            };
            const res = mockRes();

            const mockSession = { 
                _id: 'session_abc', 
                tutorId: 'tutor_555', 
                createdByTuteeId: 'student_777',
                save: jest.fn() 
            };
            mockSessionFindById.mockResolvedValue(mockSession);

            await completeSession(req, res);

            // Verified Fix: Should return 403
            expect(res.status).toHaveBeenCalledWith(403);
            expect(mockSession.save).not.toHaveBeenCalled();
        });
    });
});
