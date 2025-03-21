import React from 'react';
import { Link } from 'react-router-dom';
// import LaunchpadCountdown from './LaunchpadCountdown';
import styles from './styles.module.scss';

const LaunchpadCard = ({ dark, collection }) => {
  // let launchDate = "06/16/2022"
  // const diff = launchDate - new Date().getTime();
  // const [sale, setSale] = useState(false)
  return (
    <div className={dark ? styles.cardContainerDark : styles.cardContainer}>
      <Link to={`/launchpad/${collection.address}`}>
        <div className={styles.cardImg}>
          <img src={collection.image} alt="" />
        </div>
        <div className={styles.cardDesc}>
          <div className={styles.cardHeading}>
            <h3 className={styles.cardTitle}>{collection.nameCollection}</h3>
            <div className={styles.cardStatus}>
              <span>Live</span>
            </div>
          </div>
          <div className={styles.cardContent}>{collection.description}</div>
        </div>
        <div>
          <div className={dark ? styles.cardBtnsDark : styles.cardBtns}>
            <div className="supply">
              <label>Items:</label>
              <span> {collection.maxSupply}</span>
            </div>
            <div className={styles.price}>
              <label>Price:</label>
              <span> {collection.price} TENET</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default LaunchpadCard;
