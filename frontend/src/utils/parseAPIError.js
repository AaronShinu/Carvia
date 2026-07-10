export function parseAPIError(err, fallback = "Something went wrong, please try again later. ") {
    const data = err?.response?.data

    if (!data || typeof data !== "object") {
        return fallback
    }

    if (data.detail) {
        return data.detail
    }

    const firstField = Object.keys(data)[0]
    if (!firstField) return fallback

    const firstMessage = data[firstField]
    if (Array.isArray(firstMessage)) {
        return firstMessage[0]
    }

    return typeof firstMessage === "string" ? firstMessage : fallback
}