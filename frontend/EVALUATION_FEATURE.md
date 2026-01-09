# Evaluation Form Feature Documentation

## Overview
This document explains the new evaluation form popup and booking history updates for both Tutee and Tutor point of views (POV).

## Components Created

### 1. EvaluationForm Component
**Location:** `src/components/EvaluationForm.jsx`

A modal popup that allows tutees to evaluate their tutoring sessions. Features include:
- Session details display (Tutor, Tutee, Course, Topic, Date)
- 5 evaluation questions with 1-5 rating scale
- Comments textarea for additional feedback
- Submit button to save the evaluation

**Props:**
- `sessionData` - Object containing session information
  - `tutor` - Tutor name
  - `tutee` - Tutee name
  - `course` - Course code
  - `topic` - Session topic
  - `date` - Session date and time
- `onClose` - Function to close the modal
- `onSubmit` - Function to handle evaluation submission

**Styling:** `src/styles/EvaluationForm.css`

### 2. Updated Profile Component
**Location:** `src/pages/Profile.jsx`

Enhanced booking history section with role-based functionality:

#### Tutee POV (role: 'tutee')
- **Active Sessions:**
  - Green "Active" status badge
  - Red "Cancel" button
  
- **Completed Sessions (awaiting evaluation):**
  - Red "Evaluate" button (opens evaluation form)
  - Orange "Report" button
  
- **Done Sessions (already evaluated):**
  - Gray "Done" status badge
  - Orange "Report" button

#### Tutor POV (role: 'tutor')
- **Active Sessions:**
  - Green "Active" status badge
  - No action buttons
  
- **Done Sessions:**
  - Gray "Done" status badge
  - No action buttons

**Note:** Tutors cannot cancel, evaluate, or report sessions. Status badges are unclickable indicators only.

## How to Toggle Between POV

In `src/pages/Profile.jsx`, change the `role` property in the user state:

```javascript
const [user] = useState({
  name: "Gabby Diocadiz",
  email: "gabby@up.edu.ph",
  role: "tutee", // Change to 'tutor' for Tutor POV
  // ... rest of user data
});
```

## Booking Status States

The booking history uses three status states:

1. **active** - Session is scheduled/ongoing
2. **completed** - Session finished, awaiting evaluation (Tutee only)
3. **done** - Session evaluated or completed (read-only)

## Color Scheme

Following the design specifications:

| Element | Color | Hex Code |
|---------|-------|----------|
| Active Badge | Green | #2E7D32 |
| Done Badge | Gray | #959595 |
| Cancel Button | Red | #851C1D |
| Evaluate Button | Red | #851C1D |
| Report Button | Orange | #DF602E |
| Submit Button | Green | #3F5A36 |
| Evaluation Title | Maroon | #800020 |
| Text (Light) | Cream | #F9F6F1 |

## Evaluation Questions

The form includes 5 placeholder evaluation questions:

1. How would you rate the tutor's knowledge of the subject?
2. How effective was the tutoring session in helping you understand the material?
3. How would you rate the tutor's communication and teaching skills?
4. How well did the tutor address your questions and concerns?
5. How likely are you to recommend this tutor to other students?

**Note:** These are filler questions and should be replaced with actual evaluation criteria as needed.

## Usage Example

```javascript
// Opening the evaluation form
const handleEvaluate = (booking) => {
  setSelectedSession(booking);
  setShowEvaluation(true);
};

// Handling evaluation submission
const handleEvaluationSubmit = (evaluationData) => {
  console.log('Ratings:', evaluationData.ratings);
  console.log('Comments:', evaluationData.comments);
  // Send to backend API
};
```

## Responsive Design

Both components are fully responsive with breakpoints at:
- Desktop: Full layout with all features
- Tablet (768px): Adjusted spacing and font sizes
- Mobile (480px): Stacked layout with optimized button sizes

## Future Enhancements

Consider implementing:
- Backend integration for saving evaluations
- Email notifications after evaluation
- Tutor dashboard to view received evaluations
- Analytics/ratings aggregation
- Custom evaluation questions per course/tutor

## Testing

To test the feature:

1. Navigate to `/profile` route
2. Set user role to `tutee` in Profile.jsx
3. Click "Evaluate" button on a completed session
4. Fill out the evaluation form
5. Click "Submit" to see console output
6. Change role to `tutor` to verify limited functionality

## Files Modified/Created

- ✅ `src/components/EvaluationForm.jsx` - New component
- ✅ `src/styles/EvaluationForm.css` - New styles
- ✅ `src/pages/Profile.jsx` - Updated with evaluation integration
- ✅ `src/styles/Profile.css` - Updated with new button/badge styles
