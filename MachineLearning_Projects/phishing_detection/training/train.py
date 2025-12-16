import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from lightgbm import LGBMClassifier
from sklearn.metrics import classification_report
from features.url_features import extract_features

# =========================
# 1. Load Raw Data
# =========================

benign = pd.read_csv("data/raw/benign.csv", header=None)
benign.columns = ["url"]
benign["label"] = 0

phish = pd.read_csv("data/raw/phishing.csv")
phish = phish[["url"]]
phish["label"] = 1

df = pd.concat([benign, phish], ignore_index=True)
df.dropna(inplace=True)

# =========================
# 2. Feature Extraction
# =========================

feature_rows = []

for url in df["url"]:
    feature_rows.append(extract_features(url))

X = pd.DataFrame(feature_rows)
y = df["label"]

X["label"] = y
X.to_csv("data/processed/dataset.csv", index=False)

# =========================
# 3. Train-Test Split
# =========================

X = X.drop("label", axis=1)
y = y

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# =========================
# 4. Train SVM
# =========================

svm = SVC(kernel="rbf", probability=True)
svm.fit(X_train, y_train)

print("\nSVM RESULTS")
print(classification_report(y_test, svm.predict(X_test)))

joblib.dump(svm, "models/svm_model.pkl")

# =========================
# 5. Train LightGBM
# =========================

lgbm = LGBMClassifier(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=6,
    random_state=42
)

lgbm.fit(X_train, y_train)

print("\nLIGHTGBM RESULTS")
print(classification_report(y_test, lgbm.predict(X_test)))

joblib.dump(lgbm, "models/lgbm_model.pkl")

print("\nTraining completed. Models saved.")
