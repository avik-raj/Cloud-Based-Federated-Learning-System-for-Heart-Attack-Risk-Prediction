import os
import json
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import (
    confusion_matrix,
    roc_curve,
    auc,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
)

# Import the trained models/results from Model_training.py.
# Running this file will execute Model_training.py first, so the models
# and predictions are created using the same pipeline as your project.
from Model_training import (
    model,
    global_model,
    X_train_encoded,
    X_val_encoded,
    X_test_encoded,
    y_train,
    y_val,
    y_test,
    y_test_numeric,
    y_test_prob,
    y_test_prob_global,
    y_test_pred,
    y_test_pred_global,
    hospital_weights,
)

GRAPH_DIR = "graphs"
os.makedirs(GRAPH_DIR, exist_ok=True)


# ============================================================
# 1. MODEL PERFORMANCE COMPARISON
# ============================================================

central_accuracy = accuracy_score(y_test_numeric, y_test_pred)
central_precision = precision_score(y_test_numeric, y_test_pred)
central_recall = recall_score(y_test_numeric, y_test_pred)
central_f1 = f1_score(y_test_numeric, y_test_pred)

fed_accuracy = accuracy_score(y_test_numeric, y_test_pred_global)
fed_precision = precision_score(y_test_numeric, y_test_pred_global)
fed_recall = recall_score(y_test_numeric, y_test_pred_global)
fed_f1 = f1_score(y_test_numeric, y_test_pred_global)

central_roc = auc(
    *roc_curve(y_test_numeric, y_test_prob)[:2]
)

fed_roc = auc(
    *roc_curve(y_test_numeric, y_test_prob_global)[:2]
)

metrics = ["Accuracy", "Precision", "Recall", "F1-score"]
central_values = [
    central_accuracy,
    central_precision,
    central_recall,
    central_f1,
]
fed_values = [
    fed_accuracy,
    fed_precision,
    fed_recall,
    fed_f1,
]

x = np.arange(len(metrics))
width = 0.35

plt.figure(figsize=(10, 6))
plt.bar(x - width / 2, np.array(central_values) * 100, width, label="Centralized")
plt.bar(x + width / 2, np.array(fed_values) * 100, width, label="Federated")
plt.xticks(x, metrics)
plt.ylabel("Score (%)")
plt.ylim(0, 100)
plt.title("Centralized vs Federated Model Performance")
plt.legend()
plt.tight_layout()
plt.savefig(
    os.path.join(GRAPH_DIR, "model_performance_comparison.png"),
    dpi=200,
)
plt.close()


# ============================================================
# 2. ROC CURVE
# ============================================================

fpr_central, tpr_central, _ = roc_curve(
    y_test_numeric, y_test_prob
)
fpr_fed, tpr_fed, _ = roc_curve(
    y_test_numeric, y_test_prob_global
)

plt.figure(figsize=(8, 6))
plt.plot(
    fpr_central,
    tpr_central,
    label=f"Centralized (AUC = {central_roc:.3f})",
)
plt.plot(
    fpr_fed,
    tpr_fed,
    label=f"Federated (AUC = {fed_roc:.3f})",
)
plt.plot([0, 1], [0, 1], linestyle="--", label="Random classifier")
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve: Centralized vs Federated")
plt.legend()
plt.tight_layout()
plt.savefig(
    os.path.join(GRAPH_DIR, "roc_curve_comparison.png"),
    dpi=200,
)
plt.close()


# ============================================================
# 3. CENTRALIZED CONFUSION MATRIX
# ============================================================

cm_central = confusion_matrix(
    y_test_numeric,
    y_test_pred,
)

plt.figure(figsize=(6, 5))
plt.imshow(cm_central, interpolation="nearest")
plt.title("Centralized Model Confusion Matrix")
plt.colorbar()
plt.xticks([0, 1], ["No", "Yes"])
plt.yticks([0, 1], ["No", "Yes"])
plt.xlabel("Predicted")
plt.ylabel("Actual")

for i in range(2):
    for j in range(2):
        plt.text(
            j,
            i,
            cm_central[i, j],
            ha="center",
            va="center",
        )

plt.tight_layout()
plt.savefig(
    os.path.join(GRAPH_DIR, "centralized_confusion_matrix.png"),
    dpi=200,
)
plt.close()


# ============================================================
# 4. FEDERATED CONFUSION MATRIX
# ============================================================

cm_fed = confusion_matrix(
    y_test_numeric,
    y_test_pred_global,
)

plt.figure(figsize=(6, 5))
plt.imshow(cm_fed, interpolation="nearest")
plt.title("Federated Model Confusion Matrix")
plt.colorbar()
plt.xticks([0, 1], ["No", "Yes"])
plt.yticks([0, 1], ["No", "Yes"])
plt.xlabel("Predicted")
plt.ylabel("Actual")

for i in range(2):
    for j in range(2):
        plt.text(
            j,
            i,
            cm_fed[i, j],
            ha="center",
            va="center",
        )

plt.tight_layout()
plt.savefig(
    os.path.join(GRAPH_DIR, "federated_confusion_matrix.png"),
    dpi=200,
)
plt.close()


# ============================================================
# 5. HOSPITAL AGGREGATION WEIGHTS
# ============================================================

hospital_names = ["Hospital 1", "Hospital 2", "Hospital 3"]
hospital_percentages = [weight * 100 for weight in hospital_weights]

plt.figure(figsize=(8, 5))
plt.bar(hospital_names, hospital_percentages)
plt.ylabel("Aggregation Weight (%)")
plt.ylim(0, 50)
plt.title("Federated Hospital Aggregation Weights")
plt.tight_layout()
plt.savefig(
    os.path.join(GRAPH_DIR, "hospital_aggregation_weights.png"),
    dpi=200,
)
plt.close()


# ============================================================
# 6. TARGET DISTRIBUTION
# ============================================================

target_counts = y_test.value_counts().reindex(["No", "Yes"])

plt.figure(figsize=(7, 5))
plt.bar(
    ["No heart attack", "Heart attack"],
    target_counts.values,
)
plt.ylabel("Number of records")
plt.title("Test Set Target Distribution")
plt.tight_layout()
plt.savefig(
    os.path.join(GRAPH_DIR, "target_distribution.png"),
    dpi=200,
)
plt.close()


# ============================================================
# 7. EXPORT DATA FOR THE WEBSITE
# ============================================================

website_data = {
    "modelPerformance": [
        {
            "metric": "Accuracy",
            "centralized": round(central_accuracy * 100, 2),
            "federated": round(fed_accuracy * 100, 2),
        },
        {
            "metric": "Precision",
            "centralized": round(central_precision * 100, 2),
            "federated": round(fed_precision * 100, 2),
        },
        {
            "metric": "Recall",
            "centralized": round(central_recall * 100, 2),
            "federated": round(fed_recall * 100, 2),
        },
        {
            "metric": "F1-score",
            "centralized": round(central_f1 * 100, 2),
            "federated": round(fed_f1 * 100, 2),
        },
    ],
    "rocAuc": {
        "centralized": round(central_roc, 4),
        "federated": round(fed_roc, 4),
    },
    "confusionMatrix": {
        "centralized": cm_central.tolist(),
        "federated": cm_fed.tolist(),
    },
    "hospitalWeights": [
        {
            "hospital": name,
            "weight": round(weight * 100, 2),
        }
        for name, weight in zip(hospital_names, hospital_weights)
    ],
    "targetDistribution": [
        {
            "label": label,
            "count": int(count),
        }
        for label, count in target_counts.items()
    ],
}

with open("graph_data.json", "w", encoding="utf-8") as file:
    json.dump(website_data, file, indent=4)

print("\n===== GRAPH GENERATION COMPLETE =====")
print("Graphs saved in:", GRAPH_DIR)
print("Website chart data saved as: graph_data.json")
print("\nGenerated files:")

for filename in sorted(os.listdir(GRAPH_DIR)):
    print("-", os.path.join(GRAPH_DIR, filename))
