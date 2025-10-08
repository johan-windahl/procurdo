import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Re-export shared utilities
export { formatThousandsSpaces, normalizeNumericInput } from "@procurdo/shared/lib/utils";
