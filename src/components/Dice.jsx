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
  // Calculate rotation to show the correct face on top
  // Animation ends at rotateX(-630deg) rotateY(360deg) rotateZ(0deg)
  // -630 = -720 + 90, so top face (face-3) is tilted 90deg toward viewer
  // To show different faces, we adjust rotations
  const getRotation = (val) => {
    const rotations = {
      // Face 1 (front face): rotate so front tilts up
      1: 'rotateX(-540deg) rotateY(360deg) rotateZ(0deg)',
      // Face 2 (right face): rotate Y to bring right side to front, then tilt
      2: 'rotateX(-630deg) rotateY(270deg) rotateZ(0deg)',
      // Face 3 (top face): this is the base position
      3: 'rotateX(-630deg) rotateY(360deg) rotateZ(0deg)',
      // Face 4 (bottom face): flip 180 on X
      4: 'rotateX(-450deg) rotateY(360deg) rotateZ(0deg)',
      // Face 5 (left face): rotate Y to bring left side to front
      5: 'rotateX(-630deg) rotateY(450deg) rotateZ(0deg)',
      // Face 6 (back face): rotate to bring back to front
      6: 'rotateX(-720deg) rotateY(360deg) rotateZ(0deg)',
    };
    return rotations[val] || rotations[1];
  };

  const getShadowClass = () => {
    if (isThrowing) return 'dice-shadow animating';
    if (!isRolling) return 'dice-shadow visible';
    return 'dice-shadow';
  };

  return (
    <div className="dice-scene">
      <div className={`dice-wrapper ${isThrowing ? 'throwing' : ''}`}>
        <div
          ref={ref}
          className={`dice ${isRolling ? 'rolling' : ''}`}
          style={!isRolling ? { transform: getRotation(value) } : undefined}
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
