export function redactText(value: string): string {
    return value
        .replace(
            /postgres(?:ql)?:\/\/[^\s"'<>]+/gi,
            "[REDACTED_DATABASE_URL"
        )
        .replace(
            /\bBearer\s+[A-Za-z0-9._~-]+/gi,
            "Bearer [REDACTED]"
        )
        .replace(
            /\b(password|token|secret|api[_-]?key)\s*[:=]\s*[""']?[^\s,'"}]+/gi,
            "$1=[REDACTED]"
        )
}