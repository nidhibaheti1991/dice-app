import { usePremium } from '../contexts/PremiumContext';
import './PremiumModal.css';

const FEATURES = {
  soundEffects: {
    name: 'Sound Effects',
    description: 'Calming dice roll and coin flip sounds',
    price: '$0.99',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    ),
  },
  ambientSound: {
    name: 'Ambient Fire',
    description: 'Cozy crackling fireplace sounds',
    price: '$0.99',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22c3.31 0 6-2.69 6-6 0-2.5-1.5-4.5-3-6-1.5 1.5-3 3.5-3 6 0 1.1-.9 2-2 2s-2-.9-2-2c0-1.5.5-2.5 1-3.5.5-1 1-2 1-3.5 0-2.5-1.5-4.5-3-6-1.5 1.5-3 3.5-3 6 0 5.52 4.48 10 10 10z"/>
      </svg>
    ),
  },
};

export default function PremiumModal({ isOpen, onClose }) {
  const { purchaseFeature, hasPurchased } = usePremium();

  if (!isOpen) return null;

  const handlePurchase = (feature) => {
    // In a real app, this would integrate with a payment processor
    // For demo purposes, we'll just unlock the feature
    purchaseFeature(feature);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="premium-modal-overlay" onClick={handleOverlayClick}>
      <div className="premium-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="modal-header">
          <h2>Premium Upgrades</h2>
          <p>Enhance your experience with these one-time purchases</p>
        </div>

        <div className="features-list">
          {Object.entries(FEATURES).map(([key, feature]) => {
            const purchased = hasPurchased(key);
            return (
              <div key={key} className={`feature-card ${purchased ? 'purchased' : ''}`}>
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-info">
                  <h3>{feature.name}</h3>
                  <p>{feature.description}</p>
                </div>
                <div className="feature-action">
                  {purchased ? (
                    <span className="purchased-badge">Owned</span>
                  ) : (
                    <button
                      className="purchase-button"
                      onClick={() => handlePurchase(key)}
                    >
                      {feature.price}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <p>One-time purchase • No subscription</p>
        </div>
      </div>
    </div>
  );
}
