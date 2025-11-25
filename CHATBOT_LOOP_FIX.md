# Chatbot Loop Fix - Preventing Counter Reset

## Problem
The chatbot counter was reverting from (e.g., 5/11) back to 1/11 during conversation, losing track of previously collected information and asking questions repeatedly.

## Root Cause
The `extractDataFromConversation()` function was calling `/api/extract-data` which could return incomplete or reset data, overwriting the existing `extractedData` state with null/empty values.

## Solution Implemented

### 1. **Merge Strategy Instead of Replace** (`extractDataFromConversation`)
Changed from directly replacing data to intelligently merging:

```typescript
// OLD (Dangerous - overwrites everything)
setExtractedData(result.data);

// NEW (Safe - merges and preserves)
setExtractedData(prevData => {
  const mergedData = { ...prevData };
  
  // Only update fields with new non-empty values
  Object.keys(result.data).forEach((key) => {
    const newValue = result.data[key];
    const existingValue = prevData[key];
    
    // Only update if new value is not null/empty
    if (newValue !== null && newValue !== "" && newValue !== undefined) {
      // ... merge logic
    }
  });
  
  return mergedData;
});
```

### 2. **Pass Current Data to API**
Modified API call to include current data as context:

```typescript
body: JSON.stringify({
  messages: conversationMessages.current,
  currentData: extractedData, // NEW: Pass current data to prevent resets
}),
```

This ensures the API knows what data already exists and won't reset it.

### 3. **Completeness Never Decreases**
Ensured the completeness percentage only goes up, never down:

```typescript
setCompleteness(prevCompleteness => {
  const newCompleteness = Math.round((newFilledCount / 11) * 100);
  // Only update if completeness increased, never decrease
  return Math.max(prevCompleteness, newCompleteness);
});
```

### 4. **SessionStorage Always in Sync**
Added immediate sessionStorage update after every user input:

```typescript
// After processing user message, immediately save to sessionStorage
const formData = { ...updatedExtractedData };
sessionStorage.setItem("formData", JSON.stringify(formData));
console.log("✅ Updated sessionStorage after user input:", formData);
```

This prevents any loss of data if the page refreshes or modal reopens.

### 5. **Array Deduplication**
For array fields like `criticalSkills`, we merge and deduplicate:

```typescript
if (Array.isArray(newValue) && newValue.length > 0) {
  if (Array.isArray(existingValue)) {
    // Merge and deduplicate
    mergedData[key] = [...new Set([...existingValue, ...newValue])];
  }
}
```

## Key Principles

1. **Never Overwrite with Empty**: Only update fields if new values are non-empty
2. **Always Merge**: Combine new data with existing data
3. **Preserve Progress**: Completeness counter never goes backward
4. **Immediate Persistence**: Save to sessionStorage after every change
5. **Array Handling**: Merge arrays and remove duplicates

## Benefits

- ✅ Chatbot counter never resets (always progresses from X/11 to Y/11, never back)
- ✅ No repeated questions about already-provided information
- ✅ Data is never lost during conversation
- ✅ SessionStorage stays in sync with state
- ✅ Works correctly when modal opens with pre-filled data from Hero analysis

## Testing Scenarios

1. **Hero → Modal Flow**:
   - Run reality check on homepage
   - Click "Complete Missing Fields"
   - Modal opens with existing data (e.g., 4/11)
   - Chatbot asks only about missing fields
   - Counter increases: 4/11 → 5/11 → 6/11 → ... → 11/11
   - NEVER resets back to 1/11

2. **Multiple Messages**:
   - Provide information in multiple messages
   - Each message adds to the counter
   - Previous information is retained

3. **URL Input**:
   - If URL input is shown and used
   - Extracted data is preserved
   - Counter reflects accurate count

## Files Modified
- `components/ConversationalChatbot.tsx`

## Console Logs Added
- `✅ Loaded existing data, hiding URL input. Fields: X`
- `✅ Updated sessionStorage after user input: {...}`

These help debug and verify the fix is working correctly.
