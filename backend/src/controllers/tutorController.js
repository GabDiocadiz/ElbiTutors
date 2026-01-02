import Tutor from "../models/Tutor.js";
import User from "../models/User.js";

/**
 * @desc    Get all Tutors (with sophisticated search)
 * @route   GET /api/tutors
 * @access  Public
 * @srs     2.2 Tutor Discovery & Search
 * @srs     4.4.3 REQ-5 Specialization as searchable keywords
 */
export const getTutors = async (req, res) => {
  const { keyword, subject } = req.query;

  try {
    // Base Query: We only list CERTIFIED tutors (SRS 2.3)
    let query = { certified: true };

    // --- SEARCH LOGIC ---
    if (keyword) {
      const regex = new RegExp(keyword, 'i'); // Case-insensitive

      // Step A: Find Users matching the name (e.g., "Juan")
      const userMatches = await User.find({ name: regex }).select('_id');
      const userIds = userMatches.map(u => u._id);

      // Step B: Construct Tutor Query
      // Match if: 
      // 1. The Tutor's User ID is in the name list OR
      // 2. The Tutor's Bio matches OR
      // 3. The Tutor's Specialization text matches OR
      // 4. The Tutor offers a subject matching the keyword
      query.$or = [
        { userId: { $in: userIds } },
        { bio: regex },
        { specializationText: regex },
        { subjectsOffered: regex } 
      ];
    }

    // --- FILTER LOGIC (Strict Subject Match) ---
    if (subject) {
      // SRS 2.2: Course codes serve as searchable tags
      query.subjectsOffered = { $in: [subject] };
    }

    // Execute
    const tutors = await Tutor.find(query)
      .populate("userId", "name email picture degree_program classification") // Join User Data
      .select("-__v"); // Clean output

    res.json(tutors);

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server Error: Unable to retrieve tutors." });
  }
};

/**
 * @desc    Get a single tutor's full profile
 * @route   GET /api/tutors/:id
 * @access  Public
 * @srs     4.4.3 REQ-1 Dedicated profile page
 */
export const getTutorById = async (req, res) => {
  try {
    // Validate MongoID format to prevent server crashes on bad URLs
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "Tutor not found (Invalid ID)" });
    }

    const tutor = await Tutor.findById(req.params.id)
      .populate("userId", "name email picture degree_program classification");

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update Tutor Profile
 * @route   PUT /api/tutors/profile
 * @access  Private (Tutor Only)
 * @srs     4.4.3 REQ-2, REQ-3, REQ-4
 */
export const updateTutorProfile = async (req, res) => {
  const { 
    bio, 
    specializationText, 
    subjectsOffered, 
    availabilityImage 
  } = req.body;

  try {
    // 1. Find the Tutor linked to the logged-in User
    const tutor = await Tutor.findOne({ userId: req.user._id });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor profile not found. Are you a certified tutor?" });
    }

    // 2. Update Allowed Fields Only (Security)
    if (bio !== undefined) tutor.bio = bio;
    
    // SRS 4.4.3 REQ-4: Store subjects as comma-separated text (or array in model)
    // We enforce array format here for safety
    if (subjectsOffered !== undefined) {
      if (Array.isArray(subjectsOffered)) {
        tutor.subjectsOffered = subjectsOffered;
      } else if (typeof subjectsOffered === 'string') {
        // Handle "CMSC 11, MATH 17" string input just in case
        tutor.subjectsOffered = subjectsOffered.split(',').map(s => s.trim());
      }
    }

    if (specializationText !== undefined) tutor.specializationText = specializationText;
    
    // SRS 4.4.3 REQ-3: Visual representation of availability (Link or Image URL)
    if (availabilityImage !== undefined) tutor.availabilityImage = availabilityImage;

    // 3. Save
    // SRS 4.4.2: "Sends a request to the admins" 
    // Note: For this implementation, we allow direct edits, but in a full version, 
    // we might set `tutor.isProfileVerified = false` here to trigger re-approval.
    const updatedTutor = await tutor.save();

    res.json(updatedTutor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};