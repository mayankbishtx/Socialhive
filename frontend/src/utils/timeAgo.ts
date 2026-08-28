export default function timeAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`; 

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const isCurrentYear = now.getFullYear() === past.getFullYear();

    return past.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        ...(isCurrentYear ? {} : { year: "numeric"}),
    });
}