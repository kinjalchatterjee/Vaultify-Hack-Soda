# Vaultify-Hack-Soda
- Vaultify is a hybrid identity solution combining blockchain security with centralized efficiency, allowing users to control personal data and monitor access through immutable logs

## Inspiration

- In today's digital landscape, users frequently share personal data with e-commerce platforms without full control over how it's used or secured. High-profile data breaches and growing concerns over privacy inspired us to create Vaultify—a solution that empowers users to take back control of their personal information. Allowing users to assess the access data logs for their credit card usage. We wanted to leverage blockchain technology to enhance data security, privacy, and trust between users and online platforms.

## What it does

- Vaultify is a blockchain-based secure identity management system designed for e-commerce platforms. It encrypts and stores users' personal data on a permissioned blockchain, ensuring that only authorized parties can access it with explicit user consent. Users can grant or revoke access to their data through a user-friendly interface. Vaultify provides transparent access logs recorded on the blockchain, allowing users to audit who accessed their data and when.

## How we built it

- We built Vaultify using Hyperledger Fabric as our blockchain solution to ensure data privacy and control over network participants. Smart contracts (chaincode) written in Node.js handle data permissions and transactions, enforcing user-controlled access. The front-end was developed with Next.js, React.js, Tailwind CSS, Framer-Motion, and other design frameworks for a responsive user experience, and sleek design components. Our back-end uses Node.js with Express.js, and we integrated the Hyperledger SDK to interact with the blockchain network and chaincode for writing smart contracts which were containerized and run in a Docker container. For encryption, we implemented AES for data encryption and RSA for key management and digital signatures.

## Challenges we ran into

- Integrating blockchain technology with a traditional web application presented several challenges. Managing encryption and key management securely was complex, particularly ensuring that only users could access their private keys. Achieving high performance while integrating the backend with the blockchain and frontend aspects of this project while maintaining high security standards was also a significant hurdle. Additionally, ensuring compliance with data protection regulations like GDPR and PCI DSS required careful consideration in how we stored and managed personal data.

## Accomplishments that we're proud of

- We're proud to have developed a functional prototype that seamlessly integrates blockchain technology into a user-friendly web application. Successfully implementing user-controlled data access and immutable access logs on the blockchain demonstrates the potential of decentralized technologies in enhancing data security. We also take pride in our robust encryption methods and putting the power of personal data back into the user’s hands.

## What we learned

- This project deepened our understanding of blockchain technology and its practical applications in data security and identity management. We learned about the complexities of smart contract development, encryption techniques, and the importance of balancing decentralized and centralized components (hybrid solution) for optimal performance and compliance. Additionally, we gained insights into user experience design, especially in making advanced security features accessible and understandable to end-users.

## What's next for Vaultify

- Moving forward, we plan to enhance Vaultify by integrating advanced machine learning algorithms for sophisticated anomaly detection and real-time threat analysis. We aim to expand our platform's compatibility with more e-commerce partners and explore opportunities for scaling the application to handle a larger user base. Ultimately, we aspire to establish Vaultify as a standard for secure identity management in the e-commerce industry, empowering users worldwide to protect their assets with confidence.

# Getting Started

## Prerequisites

- Navigate to Vaultify-Frontend-main
- Navigate to Vaultify-Blockchain-Backend-main and Vaultify-Blockchain-Backend-main/backend
- **npm**

  ```bash
  npm install

- Install Fabric-Samples in the backend

- **git clone**

  ```bash
  git clone https://github.com/hyperledger/fabric-samples.git

- Run docker files containing the chaincode (smart contracts) while in the fabric-samples/testnetwork.js directory
  ```bash
  curl -sSL https://bit.ly/2ysbOFE | bash -s
  cd test-network
  ./network.sh up createChannel -c mychannel
  ./network.sh deployCC -ccn accesscontrol -ccv 1 -cci initLedger -ccl javascript -ccp ../../chaincode/access-control
  cp ../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json backend/fabric/

- Configure .env files

## Executing program

- Enter npm run dev in your terminal while in the frontend project directory
- Enter npm start in your terminal while in the backend project directory
- Run the docker container while in the fabric-samples/testnetwork.js directory
