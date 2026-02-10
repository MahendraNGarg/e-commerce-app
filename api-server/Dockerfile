FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY showcase_api/requirements.txt /app/showcase_api/requirements.txt
COPY showcase_api/constraints.txt /app/showcase_api/constraints.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/showcase_api/requirements.txt -c /app/showcase_api/constraints.txt

COPY . /app

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py seed_data && python manage.py runserver 0.0.0.0:8000"]

