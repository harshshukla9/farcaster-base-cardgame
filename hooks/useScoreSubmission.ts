'use client'

import { useCallback, useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { base } from 'wagmi/chains'
import contractConfig from '@/lib/contract'

interface ScoreSubmissionState {
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  error: string | null
  txHash: string | null
}

export function useScoreSubmission() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const [state, setState] = useState<ScoreSubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
  })

  const submitScore = useCallback(async (score: number, username: string, fid: number, pfp: string) => {
    if (!address) {
      setState(prev => ({
        ...prev,
        isError: true,
        error: 'Wallet not connected'
      }))
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
      // First update profile if username, fid, or pfp are provided
      if (username || fid || pfp) {
        await writeContract({
          address: contractConfig.contractAddress as `0x${string}`,
          abi: contractConfig.abi,
          functionName: 'updateProfile',
          args: [username || '', BigInt(fid || 0), pfp || ''],
          chainId: base.id,
        })
      }

      // Then add the score
      await writeContract({
        address: contractConfig.contractAddress as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'addScore',
        args: [BigInt(score)],
        chainId: base.id,
      })
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isError: true,
        error: err.message || 'Failed to submit score'
      }))
    }
  }, [address, writeContract])

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
    submitScore,
    reset,
    ...state,
    isPending: isPending || isConfirming,
  }
}
