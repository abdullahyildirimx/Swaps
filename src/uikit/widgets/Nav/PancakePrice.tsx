import React from "react";
import styled from "styled-components";
import useGetPriceData from "hooks/useGetPriceData";
import useGetPriceData2 from "hooks/useGetPriceData2";
import useGetPriceData3 from "hooks/useGetPriceData3";
import { BitcoinIcon, BinanceIcon, PancakesIcon, EthereumIcon, SvgProps } from "../../components/Svg";
import Text from "../../components/Text/Text";

const Container = styled.a`
  display: flex;
  align-items: center;
  margin-right: 4px;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`;


const PancakePrice: React.FC<{ cakePriceUsd?: number }> = ({ cakePriceUsd }) => {
  const btcPriceUsd = useGetPriceData()
  const ethPriceUsd = useGetPriceData2()
  const bnbPriceUsd = useGetPriceData3()

  return cakePriceUsd ? (
    <>
    <Container href="https://www.binance.com/en/trade/BTC_USDT?type=spot">
      <BitcoinIcon mr="4px" />
      <Text bold mr="8px">{`$${btcPriceUsd.toFixed(2)}`}</Text>
    </Container>
    <Container href="https://www.binance.com/en/trade/ETH_USDT?type=spot">
      <EthereumIcon mr="4px" />
      <Text bold mr="8px">{`$${ethPriceUsd.toFixed(2)}`}</Text>
    </Container>
    <Container href="https://www.binance.com/en/trade/BNB_USDT?type=spot">
      <BinanceIcon mr="4px" />
      <Text bold mr="8px">{`$${bnbPriceUsd.toFixed(2)}`}</Text>
    </Container>
    <Container href="https://www.binance.com/en/trade/CAKE_USDT?type=spot">
      <PancakesIcon mr="4px" />
      <Text bold mr="8px">{`$${cakePriceUsd.toFixed(3)}`}</Text>
    </Container>
    </>
  ) : <Text />
    
};

export default PancakePrice;
