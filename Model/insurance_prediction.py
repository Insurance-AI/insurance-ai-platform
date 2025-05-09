import pandas as pd
import numpy as np
import joblib
import requests
import io

base_url = "https://huggingface.co/spaces/apeksha07/insurance_prediction/resolve/main/"

def load_from_hf(filename):
    url = base_url + filename
    response = requests.get(url)
    response.raise_for_status()
    return joblib.load(io.BytesIO(response.content))

model = load_from_hf('insurance_model.pkl')
label_encoders = load_from_hf('label_encoders.pkl')
features = load_from_hf('features.pkl')
target_encoder = load_from_hf('target_encoder.pkl')

test_sample = pd.DataFrame([{
    'Age': 12,
    'Gender': 'Female',
    'Smoking Status': 'Non-Smoker',
    'Annual Income': 850000,
    'Existing Loans/Debts': 1,
    'Existing Insurance Policies': 1,
    'Desired Sum Assured': 1000,
    'Policy Term (Years)': 11,
    'Premium Payment Option': 'Limited',
    'Death Benefit Option': 'Increasing',
    'Payout Type': 'Installments',
    'Medical History': 'Diabetic',
    'Lifestyle Habits': 'Sedentary',
    'Interest in Optional Riders': False,
    'Interest in Tax Saving': True
}])

test_sample['Age Group'] = pd.cut(
    test_sample['Age'],
    bins=[0, 18, 30, 45, 60, 100],
    labels=['Child', 'Youth', 'Adult', 'MidAge', 'Senior']
)

test_sample['Income Bracket'] = pd.cut(
    test_sample['Annual Income'],
    bins=[0, 300000, 700000, 1500000, 5000000, np.inf],
    labels=['Low', 'Lower-Mid', 'Mid', 'High', 'Very High']
)

for col in features:
    if col in label_encoders:
        le = label_encoders[col]
        def safe_encode(val):
            if val in le.classes_:
                return le.transform([val])[0]
            else:
                # Handle unseen label
                le.classes_ = np.append(le.classes_, val)
                return le.transform([val])[0]
        test_sample[col] = test_sample[col].apply(safe_encode)

X_new = test_sample[features].astype(float)

probs = model.predict_proba(X_new)[0]
top3_indices = np.argsort(probs)[::-1][:3]
top3_labels = target_encoder.inverse_transform(top3_indices)
top3_probs = probs[top3_indices]

print("\n🏆 Top 3 Recommended Insurance Plans for Test User:")
for i, (plan, prob) in enumerate(zip(top3_labels, top3_probs), start=1):
    print(f"{i}. {plan} (Confidence: {prob:.2%})")
