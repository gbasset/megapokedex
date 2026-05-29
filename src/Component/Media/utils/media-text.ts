export interface TruncatedTextResult {
  text: string;
  wasTruncated: boolean;
}

export function truncateText(value: string, maxLength: number): TruncatedTextResult {
  const normalizedValue = value.trim();

  if (normalizedValue.length <= maxLength) {
    return {
      text: normalizedValue,
      wasTruncated: false,
    };
  }

  const truncatedValue = normalizedValue.slice(0, maxLength).trimEnd();
  const lastWhitespaceIndex = truncatedValue.lastIndexOf(' ');
  const safeValue = lastWhitespaceIndex > Math.floor(maxLength * 0.6)
    ? truncatedValue.slice(0, lastWhitespaceIndex)
    : truncatedValue;

  return {
    text: `${safeValue}...`,
    wasTruncated: true,
  };
}
