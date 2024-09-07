import { useAccount, useBalance } from "wagmi";

export function Balance() {
  const { address } = useAccount()

  const { data: default_ } = useBalance({ address })
  const { data: account_ } = useBalance({ address })

  return (
    
    <div className="balance-container">
      <h2 className="balance-title">Balance</h2>
      <div className="balance-item">Balance (Default Chain): {default_?.formatted}</div>
      <div className="balance-item">Balance (Account Chain): {account_?.formatted}</div>
  </div>
  )
}