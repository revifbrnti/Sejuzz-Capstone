const hitungManual = (weightKg, faktorSusut, gramPerCup) => {
  const skinWeight = weightKg * faktorSusut;
  const fleshWeight = weightKg - skinWeight;
  const fleshGram = fleshWeight * 1000;
  const estimatedCups = Math.floor(fleshGram / gramPerCup);
  const remainingFleshGram = fleshGram - estimatedCups * gramPerCup;

  return {
    skinWeight: Number(skinWeight.toFixed(2)),
    fleshWeight: Number(fleshWeight.toFixed(2)),
    estimatedCups,
    remainingFleshGram: Number(remainingFleshGram.toFixed(2)),
  };
};
module.exports = { hitungManual };
