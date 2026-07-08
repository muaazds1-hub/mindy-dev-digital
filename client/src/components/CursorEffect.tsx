import { useEffect, useRef } from "react";

export function CursorEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const fadeTimeoutRef = useRef<NodeJS.Timeout>();
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;

    if (!container || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      isMovingRef.current = true;
      glow.style.opacity = "1";

      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }

      fadeTimeoutRef.current = setTimeout(() => {
        isMovingRef.current = false;
        glow.style.opacity = "0";
      }, 2000);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetRef.current = { x: touch.clientX, y: touch.clientY };
        isMovingRef.current = true;
        glow.style.opacity = "1";

        if (fadeTimeoutRef.current) {
          clearTimeout(fadeTimeoutRef.current);
        }

        fadeTimeoutRef.current = setTimeout(() => {
          isMovingRef.current = false;
          glow.style.opacity = "0";
        }, 2000);
      }
    };

    const animate = () => {
      positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.15;
      positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.15;

      glow.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ overflow: "hidden" }}
    >
      <div
        ref={glowRef}
        className="cursor-glow"
        style={{
          position: "fixed",
          width: "400px",
          height: "400px",
          marginLeft: "-200px",
          marginTop: "-200px",
          pointerEvents: "none",
          opacity: "0",
          transition: "opacity 0.3s ease-out",
          background: "radial-gradient(circle, rgba(32, 236, 162, 0.4) 0%, rgba(32, 236, 162, 0.15) 30%, rgba(32, 236, 162, 0) 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
