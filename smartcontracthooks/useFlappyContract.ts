"use client"

import { useCallback, useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'
import contractConfig from '@/lib/contract'

type LeaderboardEntry = {
  user: string
  username: string
  fid: bigint
  pfp: string
  score: bigint
}

const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
})

export function useLeaderboard(limit: number = 100) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState<number>(0)

  const contractAddress = contractConfig.contractAddress as `0x${string}`
  const abi = contractConfig.abi

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [scores, total] = await Promise.all([
        publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: 'getTopScores',
          args: [BigInt(limit)],
        }) as Promise<any[]>,
        publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: 'getTotalUsers',
        }) as Promise<bigint>,
      ])

      const normalized: LeaderboardEntry[] = (scores || []).map((d: any) => ({
        user: d.user as string,
        username: (d.username as string) || '',
        fid: BigInt(d.fid ?? 0),
        pfp: (d.pfp as string) || '',
        score: BigInt(d.score ?? 0),
      }))

      setLeaderboard(normalized)
      setTotalUsers(Number(total))
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch leaderboard')
    } finally {
      setIsLoading(false)
    }
  }, [contractAddress, abi, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { leaderboard, isLoading, error, refetch: fetchData, totalUsers }
}

export function useMyGameData() {
  const { address } = useAccount()
  const [myScore, setMyScore] = useState<number>(0)
  const [myRank, setMyRank] = useState<number | null>(null)
  const [hasScore, setHasScore] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [fid, setFid] = useState<number>(0)
  const [pfp, setPfp] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const contractAddress = contractConfig.contractAddress as `0x${string}`
  const abi = contractConfig.abi

  const load = useCallback(async () => {
    if (!address) return
    setIsLoading(true)
    try {
      const data = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: 'getUserProfile',
        args: [address],
      })) as any

      const rank = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: 'getUserRank',
        args: [address],
      })) as bigint

      setUsername((data?.username as string) || '')
      setFid(Number(data?.fid ?? 0))
      setPfp((data?.pfp as string) || '')
      const scoreNum = Number(data?.score ?? 0)
      setMyScore(scoreNum)
      setHasScore(scoreNum > 0)
      setMyRank(Number(rank))
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [address, contractAddress, abi])

  useEffect(() => {
    load()
  }, [load])

  return { myScore, myRank, hasScore, isLoading, username, fid, pfp }
}

export function useSetScore() {
  const { data: walletClient } = useWalletClient()
  const { address } = useAccount()
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const contractAddress = contractConfig.contractAddress as `0x${string}`
  const abi = contractConfig.abi

  const setScore = useCallback(
    async (score: number, username: string, fid: number, pfp: string) => {
      if (!walletClient || !address) throw new Error('Wallet not connected')
      setIsPending(true)
      setIsSuccess(false)
      try {
        const hasProfile = (await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: 'hasProfile',
          args: [address],
        })) as boolean

        const hash = await walletClient.writeContract({
          address: contractAddress,
          abi,
          functionName: hasProfile ? 'addScore' : 'setScore',
          args: hasProfile ? [BigInt(score)] : [BigInt(score), username, BigInt(fid), pfp],
        })

        await publicClient.waitForTransactionReceipt({ hash })
        setIsSuccess(true)
      } finally {
        setIsPending(false)
      }
    },
    [walletClient, address, contractAddress, abi]
  )

  return { setScore, isPending, isSuccess }
}


