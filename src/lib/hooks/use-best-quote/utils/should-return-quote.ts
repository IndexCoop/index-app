/**
 *
 * @param inputTokenAmount
 * @param inputTokenAmountQuote
 * @returns
 *    shouldReturn: indicates whether to return the quote
 *    diff: negative indicates that the amount is above,
 *          positive below the input token amount
 */
export function shouldReturnQuote(
  inputTokenAmount: bigint,
  inputTokenAmountQuote: bigint
) {
  console.log('input:', inputTokenAmount, 'quote:', inputTokenAmountQuote)
  const diff = inputTokenAmount - inputTokenAmountQuote
  const percent =
    (100 * Number(diff.toString())) / Number(inputTokenAmount.toString())
  console.log('return:', percent, '%')
  if (inputTokenAmountQuote > inputTokenAmount)
    return { shouldReturn: false, diff: Number(percent) }
  return {
    shouldReturn: Number(percent) < 1.5,
    diff: percent,
  }
}
