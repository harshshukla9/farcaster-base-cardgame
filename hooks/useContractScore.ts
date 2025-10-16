'use client'

import { useCallback, useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { base } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'
import contractConfig from '@/lib/contract'

interface ContractScoreState {
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  error: string | null
  txHash: string | null
}

export function useContractScore() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const [state, setState] = useState<ContractScoreState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
  })

  const setScore = useCallback(async (score: number, username?: string, fid?: number, pfp?: string) => {
    if (!isConnected || !address) {
      console.log("🔍 Cannot save score - wallet not connected")
      return
    }

    setState(prev => ({
      ...prev,
      isSubmitting: true,
      isError: false,
      error: null,
      isSuccess: false
    }))

    try {
      console.log("🔍 Saving score to contract:", score)
      
      // Check if user exists first using hasProfile
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      })
      
      const userExists = await publicClient.readContract({
        address: contractConfig.contractAddress as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'hasProfile',
        args: [address],
      }) as boolean
      
      console.log("🔍 User exists:", userExists)
      
      if (userExists) {
        // User exists - use addScore to add to their current score
        console.log("🔍 Adding score for existing user")
        await writeContract({
          address: contractConfig.contractAddress as `0x${string}`,
          abi: contractConfig.abi,
          functionName: 'addScore',
          args: [BigInt(score)],
          chainId: base.id,
        })
        console.log("🔍 Score added successfully (existing user)")
      } else {
        // User doesn't exist - create profile with setScore
        console.log("🔍 Creating new user profile with setScore")
        
        const defaultUsername = username || "Anonymous"
        const defaultFid = fid || 0
        const defaultPfp = pfp || ""
        
        await writeContract({
          address: contractConfig.contractAddress as `0x${string}`,
          abi: contractConfig.abi,
          functionName: 'setScore',
          args: [BigInt(score), defaultUsername, BigInt(defaultFid), defaultPfp],
          chainId: base.id,
        })
        console.log("🔍 Profile created and score set successfully (new user)")
      }
    } catch (err: any) {
      console.error("🔍 Failed to save score:", err)
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isError: true,
        error: err.message || 'Failed to save score'
      }))
    }
  }, [isConnected, address, writeContract])

  // Keep the old function name for backward compatibility
  const saveScoreToContractWithMongo = setScore

  // Update state based on transaction status
  useEffect(() => {
    if (isPending) {
      setState(prev => ({
        ...prev,
        isSubmitting: true,
        txHash: hash || null
      }))
    } else if (isConfirmed) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        txHash: hash || null
      }))
    } else if (error) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isError: true,
        error: error.message || 'Transaction failed'
      }))
    }
  }, [isPending, isConfirmed, error, hash])

  const reset = useCallback(() => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
    })
  }, [])

  return {
    setScore,
    saveScoreToContractWithMongo, // For backward compatibility
    reset,
    ...state,
    isPending: isPending || isConfirming,
  }
}
