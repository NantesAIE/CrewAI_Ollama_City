## Build du front
FROM node:20 AS frontend
WORKDIR /front
COPY citycrisisanalyser/front/package.json ./
COPY citycrisisanalyser/front/package-lock.json ./
RUN npm install
COPY citycrisisanalyser/front/ .
RUN npm run build

## Build du back
FROM python:3.11-slim AS backend
WORKDIR /app
COPY citycrisisanalyser/back/requirements.txt ./
COPY citycrisisanalyser/back/pyproject.toml ./
RUN pip install --upgrade pip \
    && pip install -r requirements.txt || true \
    && pip install . || true
COPY citycrisisanalyser/back/ .

# Copie les fichiers build du front dans le dossier du back (adapter selon usage)
COPY --from=frontend /front/build /front/build

EXPOSE 8000
CMD ["python", "main_api.py"]
