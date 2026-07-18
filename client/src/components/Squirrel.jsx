import { useEffect, useRef, useState } from 'react';
import svgContent from './squirrel-art.js';

const CLICK_ANIMS = ['eat', 'hop', 'flick', 'blink', 'eat'];

export default function Squirrel({ mood = 'neutral', size = 130, interactive = true }) {
  const [intro, setIntro] = useState(true);
  const [anim, setAnim] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  function play() {
    if (!interactive) return;
    const pick = CLICK_ANIMS[Math.floor(Math.random() * CLICK_ANIMS.length)];
    setAnim(null);
    requestAnimationFrame(() => {
      setAnim(pick);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAnim(null), 1100);
    });
  }

  const cls = [
    'squirrel',
    interactive ? 'is-interactive' : '',
    intro ? 'intro' : '',
    anim ? 'anim-' + anim : '',
    'mood-' + mood,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={cls}
      style={{ width: size, height: size }}
      onClick={play}
      role={interactive ? 'button' : 'img'}
      aria-label="Fındık maskot"
    >
      <svg
        viewBox="540 770 2870 2680"
        width={size}
        height={size}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </span>
  );
}
