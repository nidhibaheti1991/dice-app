import { forwardRef } from 'react';

const Coin = forwardRef(({ value, isFlipping, isThrowing }, ref) => {
  // value: 'heads' or 'tails'
  const getShadowClass = () => {
    if (isThrowing) return 'coin-shadow animating';
    if (!isFlipping) return 'coin-shadow visible';
    return 'coin-shadow';
  };

  // Pass target rotation as CSS custom property
  // Heads = 0deg (front), Tails = 180deg (back)
  const targetRotation = value === 'heads' ? -720 : -900; // Multiple rotations + final position

  const coinStyle = {
    '--end-rotation': `${targetRotation}deg`,
    transform: !isFlipping ? `rotateX(${targetRotation}deg)` : undefined,
  };

  return (
    <div className="coin-scene">
      <div className={`coin-wrapper ${isThrowing ? 'throwing' : ''}`}>
        <div
          ref={ref}
          className={`coin ${isFlipping ? 'flipping' : ''}`}
          style={coinStyle}
        >
          <div className="coin-face coin-heads">
            <span className="coin-symbol">H</span>
          </div>
          <div className="coin-face coin-tails">
            <span className="coin-symbol">T</span>
          </div>
        </div>
      </div>
      <div className={getShadowClass()} />
    </div>
  );
});

Coin.displayName = 'Coin';

export default Coin;
