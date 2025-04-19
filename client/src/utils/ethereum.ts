import { toast } from 'sonner'

export async function sendTransaction(params: {
  from: string
  to: string
  value: string
}) {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    // Convert ETH to Wei (1 ETH = 10^18 Wei)
    const valueInWei = BigInt(
      Math.round(parseFloat(params.value) * 10 ** 18)
    ).toString()

    // Request transaction
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: params.from,
        to: params.to,
        value: '0x' + BigInt(valueInWei).toString(16), // Convert to hex
        gas: '0x' + (21000).toString(16), // Basic transaction gas limit
      }],
    })

    // Show pending transaction notification
    toast.loading('Transaction pending...', {
      description: 'Please wait while your transaction is being processed'
    })

    // Wait for transaction to be mined
    const receipt = await waitForTransaction(txHash)

    if (receipt.status === '0x1') {
      toast.success('Transaction successful!', {
        description: 'Your NFT purchase has been completed'
      })
      return receipt
    } else {
      throw new Error('Transaction failed')
    }
  } catch (error: any) {
    console.error('Transaction error:', error)
    
    // Handle user rejection
    if (error.code === 4001) {
      toast.error('Transaction cancelled', {
        description: 'You rejected the transaction'
      })
    } else {
      toast.error('Transaction failed', {
        description: error.message || 'Please try again later'
      })
    }
    throw error
  }
}

async function waitForTransaction(txHash: string) {
  const maxAttempts = 30 // 30 attempts * 2 seconds = 60 seconds max wait time
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const receipt = await window.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      })

      if (receipt) {
        return receipt
      }
    } catch (error) {
      console.error('Error checking transaction:', error)
    }

    // Wait 2 seconds before next attempt
    await new Promise(resolve => setTimeout(resolve, 2000))
    attempts++
  }

  throw new Error('Transaction timeout')
} 