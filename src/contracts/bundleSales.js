// import { ethers } from 'ethers';

import { calculateGasMargin, getHigherGWEI } from 'utils';
import { Contracts } from 'constants/networks';
import useContract from 'hooks/useContract';

import { BUNDLE_SALES_CONTRACT_ABI } from './abi';
import { useWeb3React } from '@web3-react/core';

// eslint-disable-next-line no-undef
const isMainnet = import.meta.env.VITE_ENV === 'MAINNET';
const CHAIN = isMainnet ? 1559 : 155;

export const useBundleSalesContract = () => {
  const { getContract } = useContract();
  const { library } = useWeb3React();

  const getBundleSalesContract = async () =>
    await getContract(Contracts[CHAIN].bundleSales, BUNDLE_SALES_CONTRACT_ABI);

  const getBundleListing = async (owner, bundleID) => {
    const contract = await getBundleSalesContract();
    const listing = await contract.getListing(owner, bundleID);
    const price = parseFloat(listing.price.toString()) / 10 ** 18;
    if (price > 0) {
      return {
        // nfts: listing.nfts,
        // tokenIds: listing.tokenIds.map(val => parseInt(val.toString())),
        // quantities: listing.quantities.map(val => parseInt(val.toString())),
        price,
        startingTime: parseInt(listing.startingTime.toString()),
        // allowedAddress: listing.allowedAddress,
      };
    }
    return null;
  };

  const buyBundleETH = async (bundleID, value, from) => {
    const contract = await getBundleSalesContract();
    const args = [bundleID];

    const options = {
      value,
      from,
      gasPrice: getHigherGWEI(library),
    };

    const gasEstimate = await contract.estimateGas['buyItem(string)'](
      ...args,
      options
    );
    options.gasLimit = calculateGasMargin(gasEstimate);
    return await contract['buyItem(string)'](...args, options);
  };

  const buyBundleERC20 = async (bundleID, payToken) => {
    const contract = await getBundleSalesContract();
    return await contract['buyItem(string,address)'](bundleID, payToken);
  };

  const cancelBundleListing = async bundleID => {
    const contract = await getBundleSalesContract();
    const tx = await contract.cancelListing(bundleID);
    await tx.wait();
  };

  const listBundle = async (
    bundleID,
    nftAddresses,
    tokenIds,
    quantities,
    payToken,
    price,
    startingTime
  ) => {
    const contract = await getBundleSalesContract();
    return await contract.listItem(
      bundleID,
      nftAddresses,
      tokenIds,
      quantities,
      payToken,
      price,
      startingTime
    );
  };

  const updateBundleListing = async (bundleID, newPrice) => {
    const contract = await getBundleSalesContract();
    return await contract.updateListing(bundleID, newPrice);
  };

  const createBundleOffer = async (bundleID, payToken, price, deadline) => {
    const contract = await getBundleSalesContract();
    return await contract.createOffer(bundleID, payToken, price, deadline);
  };

  const cancelBundleOffer = async bundleID => {
    const contract = await getBundleSalesContract();
    return await contract.cancelOffer(bundleID);
  };

  const acceptBundleOffer = async (bundleID, creator) => {
    const contract = await getBundleSalesContract();
    return await contract.acceptOffer(bundleID, creator);
  };

  return {
    getBundleSalesContract,
    getBundleListing,
    buyBundleETH,
    buyBundleERC20,
    cancelBundleListing,
    listBundle,
    updateBundleListing,
    createBundleOffer,
    cancelBundleOffer,
    acceptBundleOffer,
  };
};
