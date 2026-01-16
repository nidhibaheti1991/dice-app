import { forwardRef } from 'react';

const DiceFace = ({ value }) => {
  const dots = Array(value).fill(null);

  return (
    <div className={`dice-face face-${value}`}>
      {dots.map((_, index) => (
        <div key={index} className="dot" />
      ))}
    </div>
  );
};

const Dice = forwardRef(({ value, isRolling, isThrowing }, ref) => {
  // Rotation values for each face (X and Y degrees)
  const rotationValues = {
    1: { x: -540, y: 360 },
    2: { x: -630, y: 270 },
    3: { x: -630, y: 360 },
    4: { x: -450, y: 360 },
    5: { x: -630, y: 450 },
    6: { x: -720, y: 360 },
  };

  const rotation = rotationValues[value] || rotationValues[1];

  const getShadowClass = () => {
    if (isThrowing) return 'dice-shadow animating';
    if (!isRolling) return 'dice-shadow visible';
    return 'dice-shadow';
  };

  // Pass target rotation as CSS custom properties so animation ends at correct position
  const diceStyle = {
    '--end-x': `${rotation.x}deg`,
    '--end-y': `${rotation.y}deg`,
    transform: !isRolling
      ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(0deg)`
      : undefined,
  };

  return (
    <div className="dice-scene">
      <div className={`dice-wrapper ${isThrowing ? 'throwing' : ''}`}>
        <div
          ref={ref}
          className={`dice ${isRolling ? 'rolling' : ''}`}
          style={diceStyle}
        >
          <DiceFace value={1} />
          <DiceFace value={2} />
          <DiceFace value={3} />
          <DiceFace value={4} />
          <DiceFace value={5} />
          <DiceFace value={6} />
        </div>
      </div>
      <div className={getShadowClass()} />
    </div>
  );
});

Dice.displayName = 'Dice';

export default Dice;
