import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useMulticallContract } from './useContract'
import ERC20_INTERFACE from '../constants/abis/erc20'

const priceContracts: {bnbAddress: string, busdAddress: string, lpAddress:string} = {
    bnbAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    busdAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    lpAddress: '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16'
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

const useGetPriceData3 = () => {
  const [data, setData] = useState<number>(0)

  const multicallContract = useMulticallContract();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(multicallContract){
          const {bnbAddress, busdAddress, lpAddress} = priceContracts;
          const calls = [
            [bnbAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
            [busdAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
          ];
          const [resultsBlockNumber, result] = await multicallContract.aggregate(calls);
          const [bnbAmount, busdAmount] = result.map((r: any)=>ERC20_INTERFACE.decodeFunctionResult("balanceOf", r));
          const bnb = new BigNumber(bnbAmount);
          const busd = new BigNumber(busdAmount);
          const bnbPrice = busd.div(bnb).toNumber();
          setData(bnbPrice)
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [multicallContract])

  return data
}

export default useGetPriceData3