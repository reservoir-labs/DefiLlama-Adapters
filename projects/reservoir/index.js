const { request, gql } = require('graphql-request');
const { default: BigNumber } = require('bignumber.js');

const { toUSDTBalances } = require("../helper/balances");

const GRAPHQL_URL = 'https://data.staging.arkiver.net/robolabs/reservoir-mainnet-v2/graphql';

const graphQuery = gql`
query GetStats {
  PairsCount
  PairSnapshots {
    volumeUSD
    pair { 
      tvlUSD
    }
  }
}
`;

async function tvl() {
   const {PairSnapshots} = await request(GRAPHQL_URL, graphQuery);
    const tvl = PairSnapshots.reduce((acc, curr) => {
      return acc.plus(new BigNumber(curr.pair.tvlUSD));
    }, new BigNumber(0));

    return toUSDTBalances(tvl)
}

module.exports = {
  avax: {
    tvl
   },
};
