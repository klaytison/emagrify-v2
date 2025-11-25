export function soltarConfete() {
  import("canvas-confetti").then((mod) => {
    const confetti = mod.default;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      ticks: 80,
      zIndex: 9999,
    });
  });
}
