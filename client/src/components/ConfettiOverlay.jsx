import { useEffect, useRef } from 'react';

const CONFETTI_FILES = [
  () => import('../assets/confetti/celebration.json'),
  () => import('../assets/confetti/confetti.json'),
  () => import('../assets/confetti/sparkle-burst.json'),
  () => import('../assets/confetti/confetti-effects.json'),
];

export default function ConfettiOverlay() {
  const ref = useRef(null);

  useEffect(() => {
    let anim;
    const pick = CONFETTI_FILES[Math.floor(Math.random() * CONFETTI_FILES.length)];

    Promise.all([import('lottie-web'), pick()]).then(([lottie, data]) => {
      if (!ref.current) return;
      anim = lottie.default.loadAnimation({
        container: ref.current,
        animationData: data.default,
        renderer: 'svg',
        loop: false,
        autoplay: true,
      });
    });

    return () => anim?.destroy();
  }, []);

  return <div className="confetti-overlay" ref={ref} />;
}
