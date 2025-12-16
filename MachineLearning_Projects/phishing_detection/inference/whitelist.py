import tldextract
WHITELIST = [
    "google.com",
    "youtube.com",
    "amazon.com",
    "chatgpt.com",
    "wikipedia.org",
    "reddit.com",
    "twitter.com",
    "instagram.com",
    "netflix.com",
    "microsoft.com",
    "facebook.com",
    "github.com",
    "linkedin.com",
    "apple.com"
]


def is_whitelisted(url: str) -> bool:
    ext = tldextract.extract(url)
    domain = f"{ext.domain}.{ext.suffix}"
    return domain in WHITELIST
