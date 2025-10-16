# Score Logic - How It Works

## 🎯 **Exactly What You Wanted**

Your game now correctly handles:
1. **First time player** → Sets initial score
2. **Returning player** → Adds to previous score

## 📊 **How It Works**

### **Step 1: Check if User Exists**
```typescript
const userExists = await publicClient.readContract({
  functionName: 'hasProfile',
  args: [address],
})
```

### **Step 2: Based on Result**

#### **If User is NEW (First Time Playing):**
```typescript
// Calls setScore to create profile
await writeContract({
  functionName: 'setScore',
  args: [score, username, fid, pfp]
})
```
- Creates user profile
- Sets initial score
- Example: Player scores 1000 → Their total score becomes **1000**

#### **If User EXISTS (Returning Player):**
```typescript
// Calls addScore to add to existing score
await writeContract({
  functionName: 'addScore',
  args: [score]
})
```
- Adds to existing score
- Example: Previous score was 1000, new game scores 500 → Total becomes **1500**

## 🎮 **Example Scenario**

### Game 1 (First Time):
- Player finishes with score: **1000**
- System checks: User doesn't exist
- Calls: `setScore(1000, "harshshukla", 110857, "pfp_url")`
- **Result: Total score = 1000** ✅

### Game 2 (Second Time):
- Player finishes with score: **500**
- System checks: User exists
- Calls: `addScore(500)`
- **Result: Total score = 1000 + 500 = 1500** ✅

### Game 3 (Third Time):
- Player finishes with score: **800**
- System checks: User exists
- Calls: `addScore(800)`
- **Result: Total score = 1500 + 800 = 2300** ✅

## 🔧 **Smart Contract Functions**

### `setScore(score, username, fid, pfp)` - First Time Only
```solidity
function setScore(uint256 _score, string _username, uint256 _fid, string _pfp) {
    if (!userProfiles[msg.sender].exists) {
        // Create new user profile
        userProfiles[msg.sender] = UserProfile({
            username: _username,
            fid: _fid,
            pfp: _pfp,
            score: _score,  // Initial score
            exists: true
        });
    } else {
        // Update existing user (adds to score)
        userProfiles[msg.sender].score += _score;
    }
}
```

### `addScore(score)` - Returning Players
```solidity
function addScore(uint256 _score) {
    require(userProfiles[msg.sender].exists, "User does not exist");
    userProfiles[msg.sender].score += _score;  // Add to existing
}
```

## ✅ **What Happens in Your Game**

1. **Player finishes game** → Score calculated
2. **Clicks "Submit Score"** → Calls `setScore(gameScore, username, fid, pfp)`
3. **Hook checks if user exists:**
   - ✅ **New user** → `setScore` creates profile with initial score
   - ✅ **Existing user** → `addScore` adds to previous total
4. **Leaderboard updates** → Shows cumulative score

## 🚀 **Why This Is Perfect**

- ✅ **First time players** → Get their initial score set
- ✅ **Returning players** → Scores accumulate (add up)
- ✅ **Competitive** → Players improve their total over time
- ✅ **Automatic** → No manual checking needed
- ✅ **Error-free** → Uses `hasProfile` to avoid contract errors

## 📝 **Console Logs You'll See**

**New Player:**
```
🔍 Saving score to contract: 1000
🔍 User exists: false
🔍 Creating new user profile with setScore
🔍 Profile created and score set successfully (new user)
```

**Returning Player:**
```
🔍 Saving score to contract: 500
🔍 User exists: true
🔍 Adding score for existing user
🔍 Score added successfully (existing user)
```

Your implementation is perfect! The scores will accumulate exactly as you wanted! 🎉
