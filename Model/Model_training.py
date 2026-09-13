import numpy as np
import pandas as pd


heart_df = pd.read_csv("heart_attack.csv")
heart_df = heart_df.drop_duplicates()
#print(heart_df.shape)
#print(heart_df.info())
#print(heart_df.isnull().sum().sort_values(ascending=False))
#print("Duplicate rows:", heart_df.duplicated().sum())
#print(heart_df.describe().T)

from sklearn.model_selection import train_test_split

train_df,temp_df = train_test_split(heart_df,test_size = 0.30,random_state = 42,stratify = heart_df["HadHeartAttack"])
val_df,test_df = train_test_split(temp_df,test_size=0.50,random_state = 42,stratify=temp_df["HadHeartAttack"])

#print("Train: ",train_df.shape)
#print("Validation :",val_df.shape)
#print("Test :",test_df.shape)

X_train = train_df.drop(["HadHeartAttack"], axis=1)
y_train = train_df["HadHeartAttack"]

X_val = val_df.drop(["HadHeartAttack"], axis=1)
y_val = val_df["HadHeartAttack"]

X_test = test_df.drop(["HadHeartAttack"], axis=1)
y_test = test_df["HadHeartAttack"]

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler

categorical_cols = X_train.select_dtypes('str').columns.tolist()
numerical_cols = X_train.select_dtypes(include=np.number).columns.tolist()



preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ]
)

preprocessor.fit(X_train)

X_train_encoded = preprocessor.transform(X_train)
X_val_encoded = preprocessor.transform(X_val)
X_test_encoded = preprocessor.transform(X_test)

from sklearn.model_selection import train_test_split

# Hospital 1
X_h1, X_remaining, y_h1, y_remaining = train_test_split(
    X_train_encoded,
    y_train,
    test_size=2/3,
    random_state=42,
    stratify=y_train
)

# Hospital 2 and Hospital 3
X_h2, X_h3, y_h2, y_h3 = train_test_split(
    X_remaining,
    y_remaining,
    test_size=0.5,
    random_state=42,
    stratify=y_remaining
)

from sklearn.linear_model import LogisticRegression

# Hospital data
hospital_data = [
    (X_h1, y_h1),
    (X_h2, y_h2),
    (X_h3, y_h3)
]

# Hospital weights
hospital_weights = [0.40, 0.35, 0.25]

global_model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

global_coef = np.zeros((1, X_train_encoded.shape[1]))
global_intercept = np.zeros(1)

for round_num in range(5):

    local_models = []

    for X_local, y_local in hospital_data:

        local_model = LogisticRegression(
            max_iter=1000,
            class_weight="balanced",
            warm_start=True
        )

        # Start local model from the current global model
        local_model.coef_ = global_coef.copy()
        local_model.intercept_ = global_intercept.copy()
        local_model.classes_ = np.array(["No", "Yes"])

        # Train locally
        local_model.fit(X_local, y_local)

        local_models.append(local_model)

    # Weighted FedAvg
    global_coef = sum(
        weight * model.coef_
        for weight, model in zip(hospital_weights, local_models)
    )

    global_intercept = sum(
        weight * model.intercept_
        for weight, model in zip(hospital_weights, local_models)
    )

    print("Completed round:", round_num + 1)

global_model = LogisticRegression()

global_model.coef_ = global_coef
global_model.intercept_ = global_intercept
global_model.classes_ = np.array(["No", "Yes"])

y_val_pred_global = global_model.predict(X_val_encoded)

print("Global Model Validation Accuracy:",
      (y_val_pred_global == y_val).mean())

from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score



y_val_prob_global = global_model.predict_proba(X_val_encoded)[:, 1]


from sklearn.metrics import precision_score, recall_score, f1_score

y_val_numeric = y_val.map({"No": 0, "Yes": 1})

thresholds = [i / 100 for i in range(10, 91)]

best_threshold = 0.5
best_f1 = 0

for threshold in thresholds:

    y_val_pred_threshold = (
        y_val_prob_global >= threshold
    ).astype(int)

    precision = precision_score(
        y_val_numeric,
        y_val_pred_threshold
    )

    recall = recall_score(
        y_val_numeric,
        y_val_pred_threshold
    )

    f1 = f1_score(
        y_val_numeric,
        y_val_pred_threshold
    )

    if f1 > best_f1:
        best_f1 = f1
        best_threshold = threshold

print("\n===== FEDERATED MODEL THRESHOLD TUNING =====")
print("Best Threshold:", best_threshold)
print("Best Validation F1:", best_f1)


print("\n===== FEDERATED MODEL VALIDATION RESULTS =====")

print("\nConfusion Matrix:")
print(confusion_matrix(y_val, y_val_pred_global))

print("\nClassification Report:")
print(classification_report(y_val, y_val_pred_global))

print("ROC-AUC:", roc_auc_score(y_val_numeric, y_val_prob_global))


y_test_prob_global = global_model.predict_proba(X_test_encoded)[:, 1]

y_test_pred_global = (
    y_test_prob_global >= best_threshold
).astype(int)

y_test_numeric = y_test.map({"No": 0, "Yes": 1})


print("\n===== FEDERATED MODEL TEST RESULTS =====")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test_numeric, y_test_pred_global))

print("\nClassification Report:")
print(classification_report(y_test_numeric, y_test_pred_global))

print("ROC-AUC:",
      roc_auc_score(y_test_numeric, y_test_prob_global))

#print("Global Model Validation Accuracy:",
      #(y_val_pred_global == y_val).mean())


#print(heart_df[numerical_cols].isna().sum())

#print("Categorical columns:", categorical_cols)
#print("Numerical columns:", numerical_cols)
#print("Categorical columns:", len(categorical_cols))
#print("Numerical columns:", len(numerical_cols))




print("Train encoded:", X_train_encoded.shape)
print("Validation encoded:", X_val_encoded.shape)
print("Test encoded:", X_test_encoded.shape)

from sklearn.linear_model import LogisticRegression

model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

model.fit(X_train_encoded, y_train)
y_val_pred = model.predict(X_val_encoded)

from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
print("Confusion Matrix:")
print(confusion_matrix(y_val, y_val_pred))

print("\nClassification Report:")
print(classification_report(y_val, y_val_pred))

y_val_prob = model.predict_proba(X_val_encoded)[:, 1]

print("ROC-AUC:", roc_auc_score(y_val, y_val_prob))


# Centralized Model Threshold Tuning

y_val_numeric = y_val.map({"No": 0, "Yes": 1})

thresholds = [i / 100 for i in range(10, 91)]

best_threshold_central = 0.5
best_f1_central = 0

for threshold in thresholds:

    y_val_pred_threshold = (
        y_val_prob >= threshold
    ).astype(int)

    f1 = f1_score(
        y_val_numeric,
        y_val_pred_threshold
    )

    if f1 > best_f1_central:
        best_f1_central = f1
        best_threshold_central = threshold

print("\n===== CENTRALIZED MODEL THRESHOLD TUNING =====")
print("Best Threshold:", best_threshold_central)
print("Best Validation F1:", best_f1_central)


# Centralized Model Test

y_test_prob = model.predict_proba(X_test_encoded)[:, 1]

y_test_numeric = y_test.map({"No": 0, "Yes": 1})

y_test_pred = (
    y_test_prob >= best_threshold_central
).astype(int)

print("\n===== CENTRALIZED MODEL TEST RESULTS =====")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test_numeric, y_test_pred))

print("\nClassification Report:")
print(classification_report(y_test_numeric, y_test_pred))

print("ROC-AUC:",
      roc_auc_score(y_test_numeric, y_test_prob))


import joblib

joblib.dump(global_model, "federated_model.pkl")
joblib.dump(preprocessor, "preprocessor.pkl")

print("\n===== MODEL SAVING COMPLETE =====")
print("Federated model saved as: federated_model.pkl")
print("Preprocessor saved as: preprocessor.pkl")

print("\n===== INPUT FEATURES =====")
print(list(X_train.columns))






































'''
from sklearn.ensemble import RandomForestClassifier

rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=12,
    min_samples_split=10,
    min_samples_leaf=5,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

rf_model.fit(X_train_encoded, y_train)

y_val_pred_rf = rf_model.predict(X_val_encoded)

from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

print("Random Forest Confusion Matrix:")
print(confusion_matrix(y_val, y_val_pred_rf))

print("\nRandom Forest Classification Report:")
print(classification_report(y_val, y_val_pred_rf))

y_val_prob_rf = rf_model.predict_proba(X_val_encoded)[:, 1]

print("Random Forest ROC-AUC:", roc_auc_score(y_val, y_val_prob_rf))


from sklearn.metrics import precision_score, recall_score, f1_score

y_val_numeric = y_val.map({"No": 0, "Yes": 1})
thresholds = [i / 100 for i in range(10, 91)]


best_threshold = 0
best_f1 = 0

for threshold in thresholds:
    y_pred_threshold = (y_val_prob_rf >= threshold).astype(int)

    precision = precision_score(y_val_numeric, y_pred_threshold)
    recall = recall_score(y_val_numeric, y_pred_threshold)
    f1 = f1_score(y_val_numeric, y_pred_threshold)

    if f1 > best_f1:
        best_f1 = f1
        best_threshold = threshold

print("Best Threshold:", best_threshold)
print("Best F1:", best_f1)
'''



'''
from xgboost import XGBClassifier
xgb_model = XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    scale_pos_weight=17.3,
    random_state=42,
    n_jobs=-1,
    eval_metric="logloss"
)
y_train_xgb = y_train.map({"No": 0, "Yes": 1})
y_val_xgb = y_val.map({"No": 0, "Yes": 1})
y_test_xgb = y_test.map({"No": 0, "Yes": 1})

xgb_model.fit(X_train_encoded, y_train_xgb)

y_val_pred_xgb = xgb_model.predict(X_val_encoded)
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
y_val_numeric = y_val.map({"No": 0, "Yes": 1})

print("XGBoost Confusion Matrix:")
print(confusion_matrix(y_val_xgb, y_val_pred_xgb))

print("\nXGBoost Classification Report:")
print(classification_report(y_val_xgb, y_val_pred_xgb))

y_val_prob_xgb = xgb_model.predict_proba(X_val_encoded)[:, 1]

print("XGBoost ROC-AUC:", roc_auc_score(y_val_xgb, y_val_prob_xgb))

from sklearn.metrics import precision_score, recall_score, f1_score

thresholds = [i / 100 for i in range(10, 91)]

best_threshold_xgb = 0
best_f1_xgb = 0

for threshold in thresholds:
    y_pred_threshold = (y_val_prob_xgb >= threshold).astype(int)

    precision = precision_score(y_val_numeric, y_pred_threshold)
    recall = recall_score(y_val_numeric, y_pred_threshold)
    f1 = f1_score(y_val_numeric, y_pred_threshold)

    if f1 > best_f1_xgb:
        best_f1_xgb = f1
        best_threshold_xgb = threshold

print("Best XGBoost Threshold:", best_threshold_xgb)
print("Best XGBoost F1:", best_f1_xgb)



from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

best_threshold_rf = 0.73

y_test_prob_rf = rf_model.predict_proba(X_test_encoded)[:, 1]
y_test_pred_rf = (y_test_prob_rf >= best_threshold_rf).astype(int)

y_test_numeric = y_test.map({"No": 0, "Yes": 1})

print("\n===== FINAL TEST RESULTS =====")

print("Confusion Matrix:")
print(confusion_matrix(y_test_numeric, y_test_pred_rf))

print("\nClassification Report:")
print(classification_report(y_test_numeric, y_test_pred_rf))

print("ROC-AUC:", roc_auc_score(y_test_numeric, y_test_prob_rf))



from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

best_threshold_xgb = 0.80

y_test_prob_xgb = xgb_model.predict_proba(X_test_encoded)[:, 1]
y_test_pred_xgb = (y_test_prob_xgb >= best_threshold_xgb).astype(int)

y_test_numeric = y_test.map({"No": 0, "Yes": 1})

print("\n===== FINAL XGBOOST TEST RESULTS =====")

print("Confusion Matrix:")
print(confusion_matrix(y_test_numeric, y_test_pred_xgb))

print("\nClassification Report:")
print(classification_report(y_test_numeric, y_test_pred_xgb))

print("ROC-AUC:", roc_auc_score(y_test_numeric, y_test_prob_xgb))

from sklearn.metrics import accuracy_score, roc_auc_score

y_train_prob_xgb = xgb_model.predict_proba(X_train_encoded)[:, 1]
y_train_pred_xgb = (y_train_prob_xgb >= 0.80).astype(int)

y_train_numeric = y_train.map({"No": 0, "Yes": 1})

print("\n===== XGBOOST TRAINING PERFORMANCE =====")

print("Accuracy:", accuracy_score(y_train_numeric, y_train_pred_xgb))
print("ROC-AUC:", roc_auc_score(y_train_numeric, y_train_prob_xgb))

'''
#experimented codes:
'''
from sklearn.linear_model import LogisticRegression

model_h1 = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

model_h2 = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

model_h3 = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

model_h1.fit(X_h1, y_h1)
model_h2.fit(X_h2, y_h2)
model_h3.fit(X_h3, y_h3)

import numpy as np

w1, w2, w3 = 0.40, 0.35, 0.25

global_coef = (
    w1 * model_h1.coef_
    + w2 * model_h2.coef_
    + w3 * model_h3.coef_
)

global_intercept = (
    w1 * model_h1.intercept_
    + w2 * model_h2.intercept_
    + w3 * model_h3.intercept_
)

print("Global coefficient shape:", global_coef.shape)
print("Global intercept shape:", global_intercept.shape)

print("Hospital 1:", X_h1.shape, y_h1.shape)
print("Hospital 2:", X_h2.shape, y_h2.shape)
print("Hospital 3:", X_h3.shape, y_h3.shape)

global_model = LogisticRegression()

# Set the averaged parameters
global_model.coef_ = global_coef
global_model.intercept_ = global_intercept

# Tell sklearn which classes the model predicts
global_model.classes_ = np.array(["No", "Yes"])
#y_val_pred_global = global_model.predict(X_val_encoded)
'''