# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container at /code
COPY ./requirements.txt /code/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the ./app directory from the host to /code/app in the container
COPY ./app /code/app

# ✨ NEW STEP: Run the seed_products.py script to populate the database.
# This happens during the build, before the server starts.
RUN python -m app.seed_products

# Command to run the application
# Uvicorn will run on 0.0.0.0 to be accessible from outside the container
# We remove "--reload" for production as Render handles restarting.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
