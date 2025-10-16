# Contract Integration Fix

## 🔧 **Problem Solved**

The ABI encoding error you were seeing:
```
"ABI ENCODING PARAMS/VALUES LENGTH MISMATCH. EXPECTED LENGTH (PARAMS): 1 GIVEN LENGTH (VALUES): 4"
```

**Root Cause**: The `addScore` function in your contract only accepts 1 parameter (the score), but your code was trying to pass 4 parameters (score, username, fid, pfp).

## ✅ **Solution Implemented**

### **Contract Function Analysis**
Your contract has two separate functions:
1. `addScore(uint256 _score)` - Takes only the score
2. `updateProfile(string _username, uint256 _fid, string _pfp)` - Takes user profile data

### **Updated Hook: `useContractScore.ts`**

The new hook now:
1. **First calls `updateProfile`** if user data is provided
2. **Then calls `addScore`** with just the score
3. **Matches your existing code pattern** with `saveScoreToContractWithMongo`

### **Integration with Your Code**

Your existing `handleSaveToChain` function will now work perfectly:

```typescript
const handleSaveToChain = () => {
    console.log("🔍 handleSaveToChain called");
    console.log("🔍 isConnected:", isConnected);
    console.log("🔍 address:", address);
    console.log("🔍 score:", score);
    console.log("🔍 Context:", context);
    
    if (isConnected && address && score > 0) {
        // Get Farcaster user data from context
        const farcasterUsername = context?.user?.username || username || "Anonymous";
        const farcasterFid = context?.user?.fid || fid || 0;
        const farcasterPfp = context?.user?.pfpUrl || pfp || "";
        
        console.log("🔍 Farcaster data - Username:", farcasterUsername, "FID:", farcasterFid, "PFP:", farcasterPfp);
        console.log("🔍 User requested to save score to smart contract and MongoDB:", score);
        
        // Use the enhanced hook that automatically syncs to MongoDB
        saveScoreToContractWithMongo(score, farcasterUsername, farcasterFid, farcasterPfp);
    } else {
        console.log("🔍 Cannot save score - conditions not met");
    }
};
```

### **How to Use**

1. **Import the hook**:
   ```typescript
   import { useContractScore } from '@/hooks/useContractScore'
   ```

2. **Use in your component**:
   ```typescript
   const { saveScoreToContractWithMongo, isSubmitting, isSuccess, isError, error } = useContractScore()
   ```

3. **Call the function** (exactly like your existing code):
   ```typescript
   saveScoreToContractWithMongo(score, farcasterUsername, farcasterFid, farcasterPfp)
   ```

### **Features**

✅ **Automatic Profile Update**: Updates user profile before adding score
✅ **Farcaster Integration**: Uses Farcaster context data automatically  
✅ **Error Handling**: Proper error states and messages
✅ **Transaction Tracking**: Shows transaction hash and status
✅ **Loading States**: Visual feedback during submission
✅ **Success Feedback**: Confirmation when score is submitted

### **Transaction Flow**

1. **Profile Update** (if user data provided):
   - Contract: `updateProfile(username, fid, pfp)`
   - Updates user profile on-chain

2. **Score Submission**:
   - Contract: `addScore(score)`
   - Records the score for the user

3. **Success**:
   - Both transactions confirmed
   - Score appears on leaderboard

The integration now works seamlessly with your existing code structure and the smart contract's actual function signatures! 🎉
