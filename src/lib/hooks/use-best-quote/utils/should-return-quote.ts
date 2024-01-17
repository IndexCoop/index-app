export function shouldReturnQuote(
  inputTokenAmount: bigint,
  inputTokenAmountQuote: bigint
) {
  console.log('input:', inputTokenAmount, 'quote:', inputTokenAmountQuote)
  if (inputTokenAmountQuote > inputTokenAmount)
    return { shouldReturn: false, diff: -1 }
  const diff = inputTokenAmount - inputTokenAmountQuote
  const percent =
    (100 * Number(diff.toString())) / Number(inputTokenAmount.toString())
  console.log('return:', percent, '%')
  return {
    shouldReturn: Number(percent) < 1.5,
    diff: percent,
  }
}
