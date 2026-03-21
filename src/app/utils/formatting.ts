export function formatCurrencyAUD(amount: number | undefined): string {
  if (!amount && amount !== 0) return '$0'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDateAU(dateString: string | undefined): string {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function maskTFN(tfn: string | undefined): string {
  if (!tfn) return 'N/A'
  return `*** *** ${tfn.slice(-3)}`
}

export function maskABN(abn: string | undefined): string {
  if (!abn) return 'N/A'
  return `** *** *** ${abn.slice(-3)}`
}
