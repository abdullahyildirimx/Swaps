import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useMulticallContract } from './useContract'
import ERC20_INTERFACE from '../constants/abis/erc20'

const priceContracts: {btcAddress: string, busdAddress: string, lpAddress:string} = {
    btcAddress: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    busdAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    lpAddress: '0xf45cd219aef8618a92baa7ad848364a158a24f33'
}

type ApiResponse = {
  prices: {
    [key: string]: string
  }
  update_at: string
}

/**
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */
const api = 'https://api.pancakeswap.com/api/v1/price'

const useGetPriceData = () => {
  const [data, setData] = useState<number>(0)

  const multicallContract = useMulticallContract();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(multicallContract){
          const {btcAddress, busdAddress, lpAddress} = priceContracts;
          const calls = [
            [btcAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
            [busdAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
          ];
          const [resultsBlockNumber, result] = await multicallContract.aggregate(calls);
          const [btcAmount, busdAmount] = result.map((r: any)=>ERC20_INTERFACE.decodeFunctionResult("balanceOf", r));
          const btc = new BigNumber(btcAmount);
          const busd = new BigNumber(busdAmount);
          const btcPrice = busd.div(btc).toNumber();
          setData(btcPrice)
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [multicallContract])

  return data
}

export default useGetPriceData