import re
import tldextract
from urllib.parse import urlparse

def extract_features(url: str):
    features = {}

    features["url_length"] = len(url)
    features["count_dots"] = url.count(".")
    features["count_hyphens"] = url.count("-")
    features["count_at"] = url.count("@")
    features["count_question"] = url.count("?")
    features["count_percent"] = url.count("%")
    features["count_digits"] = sum(char.isdigit() for char in url)
    features["count_letters"] = sum(char.isalpha() for char in url)

    parsed = urlparse(url)
    features["has_https"] = int(parsed.scheme == "https")

    ext = tldextract.extract(url)
    features["domain_length"] = len(ext.domain)
    features["subdomain_length"] = len(ext.subdomain)
    features["count_subdomains"] = ext.subdomain.count(".") + (1 if ext.subdomain else 0)

    suspicious_words = ["login", "secure", "account", "update", "verify"]
    features["suspicious_words"] = sum(word in url.lower() for word in suspicious_words)

    features["ip_in_url"] = int(bool(re.search(r"\d+\.\d+\.\d+\.\d+", url)))

    return features
