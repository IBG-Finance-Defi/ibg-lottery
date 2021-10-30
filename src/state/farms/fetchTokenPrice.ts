import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import axios from "axios"



const useGetPriceData = () => {
  const [data, setData] = useState<BigNumber>(new BigNumber(0))
  const API_URL = "https://api.pancakeswap.info/api/v2/tokens/0x5c46c55A699A6359E451B2c99344138420c87261"


  useEffect(() => {
    const fetchData = async () => {
        const resp = await axios.get(API_URL);
      // axios.get(API_URL).then((re)=>{
  //   setCakePriceBusd(new BigNumber(re.data.data.price))
  // });
        setData( new BigNumber(resp.data.data.price))
    }

    fetchData()
  }, [])

  return data
}

export default useGetPriceData