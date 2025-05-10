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

def recommend(data: dict):
    df = pd.DataFrame([{
        'Age': data['Age'],
        'Gender': data['Gender'],
        'Smoking Status': data['Smoking_Status'],
        'Annual Income': data['Annual_Income'],
        'Existing Loans/Debts': data['Existing_Loans_Debts'],
        'Existing Insurance Policies': data['Existing_Insurance_Policies'],
        'Desired Sum Assured': data['Desired_Sum_Assured'],
        'Policy Term (Years)': data['Policy_Term_Years'],
        'Premium Payment Option': data['Premium_Payment_Option'],
        'Death Benefit Option': data['Death_Benefit_Option'],
        'Payout Type': data['Payout_Type'],
        'Medical History': data['Medical_History'],
        'Lifestyle Habits': data['Lifestyle_Habits'],
        'Interest in Optional Riders': data['Interest_in_Optional_Riders'],
        'Interest in Tax Saving': data['Interest_in_Tax_Saving']
    }])

    df['Age Group'] = pd.cut(df['Age'], bins=[0, 18, 30, 45, 60, 100],
                             labels=['Child', 'Youth', 'Adult', 'MidAge', 'Senior'])

    df['Income Bracket'] = pd.cut(df['Annual Income'], bins=[0, 300000, 700000, 1500000, 5000000, np.inf],
                                  labels=['Low', 'Lower-Mid', 'Mid', 'High', 'Very High'])

    for col in features:
        if col in label_encoders:
            le = label_encoders[col]
            def safe_encode(val):
                if val in le.classes_:
                    return le.transform([val])[0]
                else:
                    le.classes_ = np.append(le.classes_, val)
                    return le.transform([val])[0]
            df[col] = df[col].apply(safe_encode)

    X_new = df[features].astype(float)
    probs = model.predict_proba(X_new)[0]
    top10_indices = np.argsort(probs)[::-1][:10]
    top10_labels = target_encoder.inverse_transform(top10_indices)
    top10_probs = probs[top10_indices]

    return [
        {"plan": plan, "confidence": round(float(prob), 4)}
        for plan, prob in zip(top10_labels, top10_probs)
    ]
