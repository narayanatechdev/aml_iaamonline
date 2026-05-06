#!/bin/bash

# PostgreSQL AWS RDS Setup Script
# This script helps connect to and configure PostgreSQL on AWS RDS

set -e

# Configuration
RDSHOST="amlonline.c5i4uiaecb64.eu-north-1.rds.amazonaws.com"
RDSPORT="5432"
RDSUSER="postgres"
RDSDATABASE="postgres"
AWS_REGION="eu-north-1"
SECRETS_ARN="arn:aws:secretsmanager:eu-north-1:194722403930:secret:rds!db-97c2e23a-d27d-402c-a0c6-28316684ea2e-PSAsqQ"

echo "=================================================="
echo "PostgreSQL AWS RDS Setup"
echo "=================================================="
echo ""
echo "Host: $RDSHOST"
echo "Port: $RDSPORT"
echo "User: $RDSUSER"
echo "Database: $RDSDATABASE"
echo "Region: $AWS_REGION"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://aws.amazon.com/cli/"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ jq is not installed. Please install it first:"
    echo "   brew install jq   (macOS)"
    echo "   apt-get install jq (Ubuntu/Debian)"
    exit 1
fi

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) is not installed. Please install it first:"
    echo "   brew install postgresql   (macOS)"
    echo "   apt-get install postgresql-client (Ubuntu/Debian)"
    exit 1
fi

echo "✓ All dependencies found"
echo ""

# Retrieve password from AWS Secrets Manager
echo "Retrieving database password from AWS Secrets Manager..."
RDS_PASSWORD=$(aws secretsmanager get-secret-value \
    --secret-id "$SECRETS_ARN" \
    --query 'SecretString' \
    --output text \
    --region "$AWS_REGION" | jq -r '.password')

if [ -z "$RDS_PASSWORD" ]; then
    echo "❌ Failed to retrieve password from AWS Secrets Manager"
    exit 1
fi

echo "✓ Password retrieved successfully"
echo ""

# Download RDS certificate if not present
if [ ! -f "global-bundle.pem" ]; then
    echo "Downloading RDS certificate..."
    curl https://truststore.pem.s3.amazonaws.com/global/global-bundle.pem -o global-bundle.pem
    echo "✓ Certificate downloaded"
    echo ""
fi

# Test connection
echo "Testing connection to RDS..."
PGPASSWORD="$RDS_PASSWORD" psql \
    --host="$RDSHOST" \
    --port="$RDSPORT" \
    --username="$RDSUSER" \
    --dbname="$RDSDATABASE" \
    --command="SELECT version();"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Connection successful!"
    echo ""
    echo "=================================================="
    echo "Next steps for Laravel:"
    echo "=================================================="
    echo ""
    echo "1. Update .env file with database credentials:"
    echo "   DB_CONNECTION=pgsql"
    echo "   DB_HOST=$RDSHOST"
    echo "   DB_PORT=$RDSPORT"
    echo "   DB_DATABASE=aml_iaamonline"
    echo "   DB_USERNAME=$RDSUSER"
    echo "   DB_PASSWORD=$RDS_PASSWORD"
    echo ""
    echo "2. Run migrations:"
    echo "   php artisan migrate"
    echo ""
    echo "3. Create a new database (optional):"
    echo "   PGPASSWORD=\"\$RDS_PASSWORD\" psql -h $RDSHOST -U $RDSUSER -c 'CREATE DATABASE aml_iaamonline;'"
    echo ""
else
    echo "❌ Connection failed"
    exit 1
fi
