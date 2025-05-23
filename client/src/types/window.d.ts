export interface MetaMaskEthereumProvider {
  isMetaMask?: boolean;
  request: (request: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (params: any) => void) => void;
  removeListener: (eventName: string, handler: (params: any) => void) => void;
  selectedAddress: string | null;
  chainId: string;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string
        params?: any[]
      }) => Promise<any>
      on: (eventName: string, handler: (...args: any[]) => void) => void
      removeListener: (eventName: string, handler: (...args: any[]) => void) => void
      selectedAddress?: string
      chainId?: string
      isMetaMask?: boolean
    }
  }
} 