#python3 -m venv .venv && source .venv/bin/activate
#pip install requests

# Example using your query/fields
python ted_export.py \
  --query "(publication-date >=20250701) AND (place-of-performance IN (SWE))" \
  --fields notice-title buyer-name publication-date business-country \
          contract-conclusion-date winner-decision-date \
          organisation-email-tenderer organisation-name-tenderer \
          tender-value tender-value-cur classification-cpv \
  --output out.csv \
  --limit 250 \
  --mode ITERATION \
  --lang-order swe eng