<script setup></script>
<template>
  <article class="doc">
    <section class="doc__section">
      <h3 class="doc__title">Overview</h3>
      <p class="doc__paragraph">
        Onchain is a Web3 social media platform implemented on the Arc Testnet,
        similar to X (formerly Twitter) and Threads. Unlike these platforms,
        Onchain does not use central servers for its operations. All
        interactions and activities within the platform are managed by Smart
        Contracts and recorded directly on the blockchain, ensuring security and
        transparency.
      </p>
      <p class="doc__paragraph">
        Unlike other applications, moderation on Onchain is not
        controlled by a few administrators; it is a process conducted by the
        community through consensus voting on reported profiles within the
        platform. We believe this approach helps reduce unfair censorship and
        makes the moderation process more transparent and reliable.
      </p>
      <p class="doc__paragraph">
        In addition, Onchain implements a Modules system, 
        which are pluggable and reusable components that allow specific functionalities 
        to be added to profiles or interactions on the platform. 
        This modular architecture enables each profile to customize its 
        operational logic without the need to modify the main contract, 
        fostering a flexible and extensible ecosystem.
      </p>
    </section>
    <span class="doc__line"></span>
    <section class="doc__section">
      <h3 class="doc__title">Why Onchain?</h3>
      <p class="doc__paragraph">
        Onchain was created to overcome the challenges found in both traditional
        social networks and decentralized platforms. Traditional networks face
        issues such as unfair censorship and centralized control, while
        decentralized platforms often lack an intuitive user experience and an
        effective moderation system.
      </p>
      <p class="doc__paragraph">
        To address these limitations, Onchain offers a solution that combines a
        fair moderation system and user autonomy with a modern, enhanced online
        experience enriched by innovative features.
      </p>
    </section>
    <span class="doc__line"></span>
    <section class="doc__section">
      <h3 class="doc__title">Key Features</h3>
      <p class="doc__paragraph">Upon joining Onchain, users can enjoy:</p>
      <h5>Basic Interactions (Free):</h5>
      <ul>
        <li>
          Create a free profile by entering your initial information, paying
          only the network fee.
        </li>
        <li>Edit profile information at any time.</li>
        <li>Follow other users to keep up with everything they post.</li>
        <li>Create posts with text, images, and videos.</li>
        <li>Engage with posts by liking, commenting, and sharing.</li>
        <li>
          Delete the profile, its information, or posts from the platform.
        </li>
      </ul>
      <h5>Premium Subscriber Benefits:</h5>
      <ul>
        <li>Receive a special badge to highlight your profile.</li>
        <li>
          Get a unique identifier and also be able to change it as long as it is
          not in use by another user.
        </li>
      </ul>
    </section>
    <span class="doc__line"></span>
    <section class="doc__section">
      <h3 class="doc__title">Profiles and Posts</h3>
      <p class="doc__paragraph">
        All profiles and posts created on Onchain are represented as NFTs in the
        ERC-721 standard, ensuring uniqueness, exclusivity, and ownership
        recorded on the blockchain. Compatibility with this standard facilitates
        integration with other Web3 platforms, enhancing interoperability and
        strengthening the ecosystem.
      </p>
      <h5>Profiles</h5>
      <p class="doc__paragraph">
        Each address can have only one unique profile, represented by an NFT
        token in the ERC-721 standard. These profiles store information such as
        name, avatar (in any format), unique identifier (handler), description,
        followers, social links, and other data. Initially, profile NFTs are
        temporarily held by the platform, but the user can claim them at any
        time, taking full control of their profile. If the profile NFT is in the
        user's wallet, it can also be returned to the platform to use its
        features in a simple and secure way.
      </p>
      <h5>Posts</h5>
      <p class="doc__paragraph">
        All posts on Onchain are also represented by NFTs in the ERC-721
        standard. These NFTs store information such as text, comments, likes, as
        well as media like images or videos. Like profiles, post NFTs are
        initially held by the platform, but can be transferred to the user's
        wallet at any time, giving them full control over their posts.
        Similarly, post NFTs stored in the user's wallet can be returned to the
        platform whenever desired.
      </p>
      <h5>Future Marketplace</h5>
      <p class="doc__paragraph">
        Onchain plans to build a dedicated marketplace to facilitate the buying
        and selling of profile and post NFTs. This feature will expand trading
        possibilities and further enhance the utility of NFTs within the
        ecosystem.
      </p>
    </section>
    <span class="doc__line"></span>
    <section class="doc__section">
      <h3 class="doc__title">Moderation</h3>
      <p class="doc__paragraph">
        One of the main challenges in decentralized social applications is
        moderation. In Onchain, this process is not controlled by administrators
        but is conducted by the community itself. Moderation occurs through a
        consensus-based voting system, where users collectively decide on the
        removal of profiles from the platform. This model promotes a democratic
        environment, reduces the possibility of unjust censorship, and makes the
        moderation process more transparent and trustworthy.
      </p>

      <p class="doc__paragraph">
        For a profile to be submitted for voting, it must accumulate at least 10
        reports. During the voting period, the profile cannot interact on the
        platform. If the community’s decision is to reinstate the profile, it
        can resume normal interactions. On the other hand, if the decision is to
        ban the profile, both the profile NFT and the owner's wallet address
        will be permanently blocked. In this case, the profile NFT, along with
        all its information, will be transferred to the owner's wallet.
      </p>

      <p class="doc__paragraph">
        If a profile is reinstated after voting, it cannot be subjected to
        another voting process for the next 120 days.
      </p>

      <p class="doc__paragraph">
        The voting process follows a well-defined schedule: there is a 2-day
        waiting period before the start of voting, followed by 7 days of active
        voting. Thus, the entire process lasts a total of 9 days.
      </p>

      <p class="doc__paragraph">
        To prevent manipulation by multiple wallets, participants must place a
        minimum token stake on the platform to vote. Those who participate in
        moderation not only contribute to a fairer environment but also receive
        proportional rewards from a portion of the fees generated by the
        platform.
      </p>

      <p class="doc__paragraph">
        Staked amounts can be withdrawn at any time, but if the user has
        participated in any voting, they must wait 7 days after participation to
        withdraw. Accumulated rewards, however, can be claimed at any time.
      </p>
    </section>
    <span class="doc__line"></span>
    <section class="doc__section">
      <h3 class="doc__title">Revenue Streams</h3>
      <p class="doc__paragraph">
        Onchain will ensure its financial sustainability through multiple
        revenue streams, strategically structured to foster sustainable growth
        and ensure a balanced distribution of value. This monetization model
        aims to establish a continuous flow of resources, encouraging the
        internal economy of the ecosystem and supporting the ongoing maintenance
        and development of the platform. The currency used in Onchain will be
        Wrapped Bitcoin (WBTC). Below, we highlight the main revenue generation
        strategies:
      </p>
      <h5>Currently:</h5>
      <ul>
        <li>
          <strong>Premium subscriptions:</strong> The main source of revenue for
          Onchain currently is based on premium subscriptions, which offer users
          access to advanced platform features and resources.
        </li>
      </ul>
      <h5>In the future:</h5>
      <ul>
        <li>
          <strong>NFT transactions:</strong> All transactions for buying and
          selling profiles and posts on the platform will be subject to a 2%
          fee.
        </li>
        <li>
          <strong>Ad Revenue Model:</strong>In future stages, Onchain may
          implement an advertising-based monetization model, which will be
          activated based on the platform's growth and performance.
        </li>
      </ul>
    </section>
    <span class="doc__line"></span>
    <section class="doc__section">
      <h3 class="doc__title">Rewards and Revenue Distribution</h3>
      <p class="doc__paragraph">
        Currently, to receive a portion of the revenues generated by Onchain,
        users must participate in the moderation voting system. The rewards,
        distributed in Wrapped Bitcoin (WBTC), are proportional to the amount
        staked and the number of active participations in the votes. This
        revenue distribution model ensures that the users most engaged in the
        platform's moderation process are the main beneficiaries, encouraging
        continuous and meaningful participation.
      </p>
      <p class="doc__paragraph">
        <strong>For example</strong>, if a user stakes and participates in 8 out
        of 10 votes, they will receive 80% of the rewards they would be entitled
        to, based on the total value of their stake.
      </p>
    </section>
    <span class="doc__line"></span>
    <section class="doc__section">
      <h3 class="doc__title">General Overview of Modules</h3>
      <h5>What are Modules?</h5>
      <p class="doc__paragraph">
        Modules are pluggable and reusable components that add specific functionalities to profiles or interactions within the platform. They follow a modular architecture, allowing each profile to customize its operational logic without altering the main contract, promoting greater flexibility.
      </p>
      <h5>Types of Modules</h5>
      <p class="doc__paragraph">
        There are different categories of modules, each with a specific purpose:
      </p>
      <h5>1. Follow Modules</h5>
      <p class="doc__paragraph">
        Control who can follow a profile and under what conditions. Examples:
      </p>
      <ul>
        <li>
          <strong>DefaultFollowModule:</strong> anyone can follow.
        </li>
        <li>
          <strong>PaidFollowModule:</strong> following requires payment.
        </li>
        <li>
          <strong>WhitelistFollowModule:</strong> only authorized addresses can follow.
        </li>
      </ul>
      <h5>2. Post Modules</h5>
      <p class="doc__paragraph">
        Control who can interact with posts and under what conditions. Examples:
      </p>
      <ul>
        <li>
          <strong>DefaultPostModule:</strong> anyone can interact.
        </li>
        <li>
          <strong>PaidPostModule:</strong> interaction requires payment.
        </li>
        <li>
          <strong>FollowerOnlyPostModule:</strong> only followers can interact.
        </li>
      </ul>
      <h5>How do they work?</h5>
      <p class="doc__paragraph">
        All modules follow standardized interfaces with core methods such as:
      </p>
      <ul>
        <li>
          <strong>initializeModule(...):</strong> configures the module with initial data.
        </li>
        <li>
          <strong>processAction(...):</strong>executes the logic at the moment of the action (follow, interact, collect, etc.).
This standardization ensures compatibility and makes it easier for community developers to create and integrate new modules.
        </li>
      </ul>
      <h5>Why use Modules?</h5>
      <ul>
        <li>
          <strong>Flexibility:</strong> each user defines their own usage logic.
        </li>
        <li>
          <strong>Extensibility:</strong> new modules can be created without updating the main system.
        </li>
        <li>
          <strong>Monetization:</strong> creators can charge for interactions.
        </li>
        <li>
          <strong>Control:</strong> profiles and content with clear and customized rules.
        </li>
      </ul>
    </section>
    <span class="doc__line"></span>
    <section class="doc__section">
      <h3 class="doc__title">Glossary</h3>
      <ul>
        <li>
          <strong>NFT (Non-Fungible Token):</strong> Represents a unique digital
          asset registered on the blockchain.
        </li>
        <li>
          <strong>Stake:</strong> Deposit of tokens to guarantee participation
          or security on a platform.
        </li>
        <li>
          <strong>Wrapped Bitcoin (WBTC):</strong> Representation of Bitcoin on
          the Arc Testnet.
        </li>
      </ul>
    </section>
  </article>
</template>

<style>
.doc {
  grid-column: main;
  display: grid;
  gap: 32px;
  width: min(712px, 100%);
  margin-inline: auto;
  align-content: flex-start;
  padding-block: 40px;
  padding-inline: 24px;
}
.doc__section {
  display: grid;
}
.doc__title {
  font-size: var(--step-3);
  font-weight: 600;
  line-height: 32px;
  margin-top: 16px;
  margin-bottom: 8px;
}
h5 {
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
}
.doc__line {
  height: 1px;
  width: 100%;
  display: block;
  background-color: #8a919e;
}
ul {
  padding-left: 26px;
  margin-bottom: 20px;
  list-style-type: disc;
}
li::marker {
  color: #ececec;
}
li {
  padding-left: 6px;
  margin-block: 8px;
}
strong {
  font-weight: 500;
}
.doc__paragraph {
  line-height: 150%;
  margin-block: 8px;
}
.doc__paragraph strong {
  font-weight: 600 !important;
}
@media (width < 600px) {
  .doc {
    gap: 24px;
    padding-block: 16px 24px;
  }
  .doc__title {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
