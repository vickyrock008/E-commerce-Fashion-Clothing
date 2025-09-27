# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container at /code
COPY ./requirements.txt /code/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application code
COPY ./app /code/app

# --- CHANGES START HERE ---

# 1. Copy the new startup script into the container
COPY ./start.sh /code/start.sh

# 2. Make the script executable
RUN chmod +x /code/start.sh

# 3. Set the new script as the command to run when the container starts
CMD ["/code/start.sh"]

