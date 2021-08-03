import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useMulticallContract } from './useContract'
import ERC20_INTERFACE from '../constants/abis/erc20'

const priceContracts: {ethAddress: string, busdAddress: string, lpAddress:string} = {
    ethAddress: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    busdAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    lpAddress: '0x7213a321f1855cf1779f42c0cd85d3d95291d34c'
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

const useGetPriceData2 = () => {
  const [data, setData] = useState<number>(0)

  const multicallContract = useMulticallContract();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(multicallContract){
          const {ethAddress, busdAddress, lpAddress} = priceContracts;
          const calls = [
            [ethAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
            [busdAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
          ];
          const [resultsBlockNumber, result] = await multicallContract.aggregate(calls);
          const [ethAmount, busdAmount] = result.map((r: any)=>ERC20_INTERFACE.decodeFunctionResult("balanceOf", r));
          const eth = new BigNumber(ethAmount);
          const busd = new BigNumber(busdAmount);
          const ethPrice = busd.div(eth).toNumber();
          setData(ethPrice)
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [multicallContract])

  return data
}

export default useGetPriceData2