# Editable Text Color Fix

## Issue
When editing text in the Reality Card's Feasibility Score section (which has a teal/green gradient background), the input field had a white background with white text, making the text invisible during editing.

## Root Cause
The `EditableText` component in edit mode was inheriting the white text color from parent elements but applying a white background, resulting in white-on-white text.

## Solution

### Fixed in `components/EditableCard.tsx`

Added explicit text color and background color classes to the input and textarea elements in edit mode:

```tsx
// Before
className={`${className} w-full border-2 border-[#278f8c] rounded-lg px-3 py-2 ...`}

// After  
className={`${className} w-full border-2 border-[#278f8c] rounded-lg px-3 py-2 ... text-gray-900 bg-white`}
```

### Changes Made

1. **Input fields** - Added `text-gray-900 bg-white` classes
2. **Textarea fields** - Added `text-gray-900 bg-white` classes

This ensures that:
- Text is always dark gray (`text-gray-900`) in edit mode
- Background is always white (`bg-white`) in edit mode
- Text is clearly visible regardless of parent background colors

## Impact

✅ Text is now visible when editing any field  
✅ Works on all background colors (white, colored gradients, etc.)  
✅ Consistent editing experience across all cards  
✅ No breaking changes to existing functionality  

## Testing

- ✅ Reality Card feasibility score editing
- ✅ All other cards with colored backgrounds
- ✅ Cards with white backgrounds
- ✅ Build passes successfully
- ✅ TypeScript checks pass

## Related Files

- `components/EditableCard.tsx` - Core fix applied
- `components/cards/EditableRealityCard.tsx` - Affected card

The fix is universal and applies to all editable text fields across all 13 cards.
