'use client'

import { useCallback, useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { base } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'
import contractConfig from '@/lib/contract'
//contract score hook
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
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash, // Only enable when we have a hash
      retry: 3, // Retry up to 3 times
      retryDelay: 1000, // Wait 1 second between retries
    }
  })

  const [state, setState] = useState<ContractScoreState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
  })

  // Fallback timeout for transaction confirmation
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const setScore = useCallback(async (score: number, username?: string, fid?: number, pfp?: string) => {
    if (!isConnected || !address) {
      return
    }

    // Reset state before starting
    setState(prev => ({
      ...prev,
      isSubmitting: false,
      isError: false,
      error: null,
      isSuccess: false,
      txHash: null
    }))

    try {
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
      
      if (userExists) {
        // User exists - use addScore to add to their current score
        await writeContract({
          address: contractConfig.contractAddress as `0x${string}`,
          abi: contractConfig.abi,
          functionName: 'addScore',
          args: [BigInt(score)],
          chainId: base.id,
        })
      } else {
        // User doesn't exist - create profile with setScore
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
      }
    } catch (err: any) {
      console.error("Failed to save score:", err)
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
    
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    
    if (isPending || isConfirming) {
      setState(prev => {
        // Only update if state actually needs to change
        if (prev.isSubmitting && prev.txHash === hash) {
          return prev
        }
        return {
          ...prev,
          isSubmitting: true,
          isSuccess: false,
          isError: false,
          error: null,
          txHash: hash || null
        }
      })
      
      // Set a fallback timeout for 5 seconds (Base is fast)
      if (hash && !isConfirmed) {
        const fallbackTimeout = setTimeout(() => {
          setState(prev => ({
            ...prev,
            isSubmitting: false,
            isSuccess: true,
            isError: false,
            error: null,
            txHash: hash
          }))
        }, 5000) // 5 seconds
        setTimeoutId(fallbackTimeout)
      }
    } else if (isConfirmed) {
      setState(prev => {
        // Only update if state actually needs to change
        if (prev.isSuccess && prev.txHash === hash) {
          return prev
        }
        return {
          ...prev,
          isSubmitting: false,
          isSuccess: true,
          isError: false,
          error: null,
          txHash: hash || null
        }
      })
    } else if (error || receiptError) {
      const errorMessage = error?.message || receiptError?.message || 'Transaction failed'
      setState(prev => {
        // Only update if state actually needs to change
        if (prev.isError && prev.error === errorMessage) {
          return prev
        }
        return {
          ...prev,
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          error: errorMessage,
          txHash: hash || null
        }
      })
    }
  }, [isPending, isConfirmed, isConfirming, error, receiptError, hash])

  const reset = useCallback(() => {
    // Clear any pending timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    
    setState({
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
    })
  }, [timeoutId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return {
    setScore,
    saveScoreToContractWithMongo, // For backward compatibility
    reset,
    ...state,
    isPending: isPending || isConfirming,
  }
}
