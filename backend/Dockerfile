FROM php:8.4-cli

# Install dependencies required for mysqli
RUN apt-get update && apt-get install -y \
    libmariadb-dev \
    && docker-php-ext-install mysqli pdo pdo_mysql

# Copy the backend files into the container
COPY . /app
WORKDIR /app

# Render passes the listening port via the $PORT environment variable.
EXPOSE 8000

# Start the built-in PHP server pointing to the current directory
CMD php -S 0.0.0.0:${PORT:-8000}
