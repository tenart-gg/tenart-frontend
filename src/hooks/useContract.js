import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

// eslint-disable-next-line no-undef
const isMainnet = import.meta.env.VITE_ENV === 'MAINNET';

export default () => {
  const { chainId, connector } = useWeb3React();

  const getContract = useCallback(
    async (address, abi) => {
      if (chainId) {
        const web3provider = await connector.getProvider();
        await web3provider.enable();
        const provider = new ethers.providers.Web3Provider(web3provider);
        provider.pollingInterval = 10 * 1000;
        const signer = provider.getSigner();

        return new ethers.Contract(address, abi, signer);
      } else {
        const provider = new ethers.providers.StaticJsonRpcProvider(
          isMainnet ? 'https://rpc.tenet.org' : 'https://rpc.testnet.tenet.org',
          isMainnet ? 1559 : 155
        );
        provider.pollingInterval = 10 * 1000;

        return new ethers.Contract(address, abi, provider);
      }
    },
    [chainId]
  );

  return { getContract };
};
