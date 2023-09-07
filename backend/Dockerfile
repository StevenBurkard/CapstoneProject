FROM python:alpine3.18
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
RUN pip install gunicorn
COPY . .
EXPOSE 8000
# CMD ["flask", "run", "--host=0.0.0.0"]