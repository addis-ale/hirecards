# Job Title in Shared Cards Implementation

## Overview
Added job title display to the shared card preview page so recipients know which role the hiring strategy cards were created for.

## Problem Solved
Previously, when someone received a shared link, they saw:
- "Shared Hiring Strategy Cards"
- No context about which job role the cards were for
- Generic presentation without role identification

## Solution
Now the shared preview page displays:
- **Job title prominently** at the top
- Clear context: "Hiring Strategy For [Job Title]"
- Professional badge-style design
- Job title included in share URL

## Implementation Details

### 1. Updated Share Function
**File:** `components/HireCardTabs.tsx`

#### Changes:
```tsx
// Extract job title from sessionStorage
const formData = sessionStorage.getItem("formData") || sessionStorage.getItem("heroAnalysisData");
const jobTitle = parsed.roleTitle || "Untitled Role";

// Include in URL
const shareUrl = `${baseUrl}/shared-card-preview?cards=${cardsParam}&title=${encodedTitle}`;

// Include in native share
navigator.share({
  title: `HireCard Strategy - ${jobTitle}`,
  text: `Check out my hiring strategy for ${jobTitle}`,
  url: shareUrl,
});
```

### 2. Updated Shared Preview Page
**File:** `app/shared-card-preview/page.tsx`

#### Changes:
```tsx
// Parse title from URL
const [jobTitle, setJobTitle] = useState<string>("Untitled Role");

useEffect(() => {
  const titleParam = searchParams.get("title");
  if (titleParam) {
    setJobTitle(decodeURIComponent(titleParam));
  }
}, [searchParams]);

// Display prominently
<h1 className="text-4xl md:text-5xl font-bold">
  {jobTitle}
</h1>
```

## Visual Design

### Before
```
┌─────────────────────────────────────┐
│  Shared Hiring Strategy Cards       │
│  3 cards shared with you            │
└─────────────────────────────────────┘
```

### After
```
┌─────────────────────────────────────┐
│    [Hiring Strategy For]            │
│   Senior Analytics Engineer         │
│   3 cards shared with you           │
└─────────────────────────────────────┘
```

## URL Structure

### Before
```
/shared-card-preview?cards=reality,role,pay
```

### After
```
/shared-card-preview?cards=reality,role,pay&title=Senior%20Analytics%20Engineer
```

## Design Elements

### Badge Label
```tsx
<div className="inline-block px-4 py-2 bg-[#d7f4f2] rounded-lg mb-4">
  <p className="text-sm font-medium text-[#278f8c]">
    Hiring Strategy For
  </p>
</div>
```
- Light teal background (#d7f4f2)
- Teal text (#278f8c)
- Rounded corners
- Inline block for centered alignment

### Job Title
```tsx
<h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#102a63" }}>
  {jobTitle}
</h1>
```
- Large, prominent heading
- Responsive sizing (4xl mobile, 5xl desktop)
- Dark blue color (#102a63)
- Bold weight

### Context Text
```tsx
<p className="text-gray-600 text-lg">
  {selectedCards.length} card{selectedCards.length !== 1 ? "s" : ""} shared with you
</p>
```
- Gray text for secondary info
- Larger font (text-lg)
- Dynamic card count

## User Experience Flow

### Sharing
1. User creates cards for "Senior Data Analyst"
2. Selects cards to share
3. Clicks "Share" button
4. Alert shows: "Share link copied... for 'Senior Data Analyst'"
5. Link includes job title in URL

### Receiving
1. Recipient opens link
2. Immediately sees: "Hiring Strategy For"
3. Job title displayed prominently: "Senior Data Analyst"
4. Clear context before viewing cards
5. Professional, branded appearance

## Technical Details

### URL Encoding
```tsx
const encodedTitle = encodeURIComponent(jobTitle);
```
- Handles special characters
- Spaces become %20
- Safe for URL transmission

### URL Decoding
```tsx
setJobTitle(decodeURIComponent(titleParam));
```
- Converts %20 back to spaces
- Handles all special characters
- Clean display

### Fallback Handling
```tsx
const [jobTitle, setJobTitle] = useState<string>("Untitled Role");
```
- Default if no title in URL
- Graceful degradation
- Always shows something

### Data Source
Checks both possible storage locations:
```tsx
const formData = sessionStorage.getItem("formData") || sessionStorage.getItem("heroAnalysisData");
```
- formData: From multi-step form
- heroAnalysisData: From hero quick analysis
- Covers all entry points

## Benefits

### ✅ Context
- Recipients immediately know the role
- No confusion about what they're viewing
- Professional presentation

### ✅ Clarity
- Large, prominent job title
- Clear hierarchy of information
- Easy to understand at a glance

### ✅ Branding
- Consistent with app design
- Professional appearance
- Polished user experience

### ✅ Sharing
- Better social share previews
- More descriptive share text
- Clearer communication

## Example Scenarios

### Scenario 1: Senior Data Scientist
**URL:**
```
/shared-card-preview?cards=reality,role,skill,pay&title=Senior%20Data%20Scientist
```

**Display:**
```
Hiring Strategy For
Senior Data Scientist
4 cards shared with you
```

### Scenario 2: Marketing Manager
**URL:**
```
/shared-card-preview?cards=role,fit,message&title=Marketing%20Manager%20-%20B2B%20SaaS
```

**Display:**
```
Hiring Strategy For
Marketing Manager - B2B SaaS
3 cards shared with you
```

### Scenario 3: No Title Provided
**URL:**
```
/shared-card-preview?cards=reality,role
```

**Display:**
```
Hiring Strategy For
Untitled Role
2 cards shared with you
```

## Native Share Integration

### Mobile Share Sheet
```tsx
navigator.share({
  title: "HireCard Strategy - Senior Analytics Engineer",
  text: "Check out my hiring strategy for Senior Analytics Engineer",
  url: shareUrl,
})
```

Recipients see:
- **Title**: HireCard Strategy - Senior Analytics Engineer
- **Description**: Check out my hiring strategy for Senior Analytics Engineer
- **Link**: [URL with job title]

## Alert Messages

### Success Message
```
✅ Share link copied to clipboard!

Anyone with this link can view your selected 3 cards for "Senior Analytics Engineer".
```

Clear, informative, includes job title for confirmation.

## Responsive Design

### Mobile (< 768px)
```
Hiring Strategy For
Senior Analytics
Engineer
3 cards shared
```
- 4xl heading size
- Wraps naturally
- Still readable

### Desktop (≥ 768px)
```
Hiring Strategy For
Senior Analytics Engineer
3 cards shared with you
```
- 5xl heading size
- Single line if possible
- Maximum impact

## Edge Cases Handled

### ✅ Special Characters
Job title: "Lead Engineer (Full-Stack)"
URL encoding handles parentheses correctly

### ✅ Long Titles
Job title: "Senior Full-Stack Software Engineer - Remote - EMEA"
Wraps gracefully, maintains readability

### ✅ Missing Title
No title in sessionStorage → Falls back to "Untitled Role"

### ✅ Empty Title
Empty string → Falls back to "Untitled Role"

### ✅ Unicode Characters
Job title: "Développeur Senior" → Encoded and decoded correctly

## Testing Checklist

✅ Job title displays on shared preview  
✅ URL encoding works correctly  
✅ URL decoding works correctly  
✅ Special characters handled  
✅ Long titles wrap properly  
✅ Fallback to "Untitled Role" works  
✅ Mobile responsive  
✅ Desktop responsive  
✅ Native share includes title  
✅ Alert message includes title  
✅ Build compiles successfully  

## Future Enhancements

Potential improvements:
1. **Company name** - Add company context
2. **Location** - Show where the role is based
3. **Experience level** - Display seniority badge
4. **Salary range** - Show compensation at top
5. **Custom branding** - Allow logo/colors
6. **Edit title** - Allow recipient to customize
7. **Metadata** - Show when created, by whom

## Conclusion

The job title is now prominently displayed on shared card previews, giving recipients immediate context about which role the hiring strategy is for. This creates a more professional, clear, and useful sharing experience.

**Result: Recipients always know what role they're viewing! ✅**
