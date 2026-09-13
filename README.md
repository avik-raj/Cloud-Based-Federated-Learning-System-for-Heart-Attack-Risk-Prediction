# Cloud-Based Federated Learning System for Heart Attack Risk Prediction

## Overview

This project presents a cloud-based federated machine learning system designed to predict heart attack risk while following a privacy-preserving distributed learning approach.

The system simulates a healthcare environment in which multiple hospitals or healthcare institutions possess their own patient datasets. Instead of transferring raw patient records to a central server, each participating hospital trains a local machine learning model on its own data. The learned model parameters are then aggregated using Federated Averaging (FedAvg) to create a global model.

The resulting global model can be used through a REST API to perform heart attack risk predictions on new patient data.

The project combines:

- Machine Learning
- Federated Learning
- Privacy-Preserving Distributed Training
- Cloud-Ready Backend Architecture
- REST API Deployment
- Data Preprocessing
- Model Evaluation
- Interactive Data Visualization

---

## Problem Statement

Traditional machine learning systems generally require healthcare data from multiple institutions to be collected and centralized before a model can be trained.

In healthcare environments, centralizing patient data can introduce significant privacy, security, ownership, and data-sharing challenges.

Federated Learning provides an alternative approach.

Rather than moving patient records to a central location, participating institutions can train models locally and share model parameters instead. A central aggregation process combines these local updates to produce a global model.

This project explores this approach for heart attack risk prediction.

---

## Objectives

The primary objectives of this project are:

1. Develop a machine learning system for heart attack risk prediction.
2. Perform appropriate preprocessing of numerical and categorical healthcare features.
3. Address class imbalance during model training.
4. Establish centralized machine learning models as performance benchmarks.
5. Simulate multiple hospitals participating in federated learning.
6. Implement Federated Averaging (FedAvg) for global model aggregation.
7. Compare centralized and federated model performance.
8. Provide a REST API for making predictions using the federated model.
9. Design the system to be suitable for cloud-based deployment.
10. Provide visual analysis of model performance and federated learning results.

---

## Dataset

The project uses a heart-health dataset containing approximately 246,000 patient records.

After removing duplicate records, the dataset contains:

- **246,013 records**
- **39 input features**
- **1 target variable**
- **No missing values**

### Target Variable

The prediction target is:

`HadHeartAttack`

The target distribution is highly imbalanced:

| Class | Records | Percentage |
|-------|---------|------------|
| No | 232,587 | 94.54% |
| Yes | 13,435 | 5.46% |

Because the positive class represents a relatively small proportion of the dataset, accuracy alone is not considered sufficient for evaluating the model.

Precision, recall, F1-score and ROC-AUC are therefore also evaluated.

---

## Machine Learning Pipeline

The machine learning pipeline consists of the following stages:

```text
Raw Dataset
     │
     ▼
Data Cleaning
     │
     ▼
Duplicate Removal
     │
     ▼
Train / Validation / Test Split
     │
     ▼
Feature Preprocessing
     │
     ├── Numerical Features → StandardScaler
     │
     └── Categorical Features → OneHotEncoder
     │
     ▼
Encoded Feature Matrix
     │
     ├───────────────────────┐
     ▼                       ▼
Centralized Training    Federated Training
     │                       │
     │                 ┌─────┴─────┐
     │                 ▼     ▼     ▼
     │               Hospital 1  Hospital 2  Hospital 3
     │                 │     │     │
     │                 └─────┼─────┘
     │                       ▼
     │                 FedAvg Aggregation
     │                       │
     │                       ▼
     │                 Global Model
     │
     └──────────────┬──────────────┘
                    ▼
              Model Evaluation
                    │
                    ▼
                REST API
