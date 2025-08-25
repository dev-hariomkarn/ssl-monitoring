export const readableDate = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}