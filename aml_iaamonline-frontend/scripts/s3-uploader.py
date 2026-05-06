#!/usr/bin/env python3
"""
S3 Upload utility for AML PDFs and Graphical Abstracts.

This script uploads files to AWS S3 buckets:
- PDFs: s3://authors-iaamonline/aml/pdf/articles/
- Graphical Abstracts: s3://authors-iaamonline/aml/img/Graphical Abstract/

Requirements:
- pip install boto3 pandas
- AWS credentials configured (aws configure or environment variables)
"""

import boto3
import os
import pandas as pd
from pathlib import Path
import mimetypes
import json
from botocore.exceptions import ClientError, NoCredentialsError
import time
import hashlib

# S3 Configuration
S3_BUCKET = "authors-iaamonline"
PDF_PREFIX = "aml/pdf/articles/"
IMG_PREFIX = "aml/img/Graphical Abstract/"

# Local paths
SCRAPE_DIR = "/Users/narayana/Documents/SOProjects/Scrape/"
PDF_DIR = os.path.join(SCRAPE_DIR, "aml_pdfs")
IMG_DIR = os.path.join(SCRAPE_DIR, "aml_graphical_abstracts")
EXCEL_FILE = os.path.join(SCRAPE_DIR, "aml_articles.xlsx")

class S3Uploader:
    def __init__(self):
        try:
            self.s3_client = boto3.client('s3')
            # Test credentials
            self.s3_client.head_bucket(Bucket=S3_BUCKET)
            print("✅ S3 connection successful")
        except NoCredentialsError:
            print("❌ AWS credentials not found. Please configure them first.")
            print("Run: aws configure")
            exit(1)
        except ClientError as e:
            print(f"❌ S3 connection failed: {e}")
            exit(1)
    
    def get_file_hash(self, file_path):
        """Generate MD5 hash of file for checking if upload is needed."""
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    
    def file_exists_in_s3(self, key, local_file_path):
        """Check if file already exists in S3 and is the same."""
        try:
            response = self.s3_client.head_object(Bucket=S3_BUCKET, Key=key)
            s3_etag = response['ETag'].strip('"')
            local_hash = self.get_file_hash(local_file_path)
            return s3_etag == local_hash
        except ClientError:
            return False
    
    def upload_file(self, local_path, s3_key, content_type=None):
        """Upload a file to S3."""
        try:
            if not os.path.exists(local_path):
                print(f"❌ File not found: {local_path}")
                return False
            
            # Check if file already exists
            if self.file_exists_in_s3(s3_key, local_path):
                print(f"⏭️  Skipping {s3_key} (already exists)")
                return True
            
            # Determine content type
            if content_type is None:
                content_type, _ = mimetypes.guess_type(local_path)
                if content_type is None:
                    content_type = 'application/octet-stream'
            
            # Upload file
            extra_args = {
                'ContentType': content_type,
                'ACL': 'public-read'  # Make files publicly accessible
            }
            
            print(f"📤 Uploading {os.path.basename(local_path)}...")
            self.s3_client.upload_file(local_path, S3_BUCKET, s3_key, ExtraArgs=extra_args)
            
            print(f"✅ Uploaded: s3://{S3_BUCKET}/{s3_key}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to upload {local_path}: {e}")
            return False
    
    def upload_pdfs(self, df):
        """Upload PDF files to S3."""
        print(f"\n📁 Uploading PDFs from {PDF_DIR}")
        
        if not os.path.exists(PDF_DIR):
            print(f"❌ PDF directory not found: {PDF_DIR}")
            return
        
        uploaded = 0
        total = 0
        
        for index, row in df.iterrows():
            article_id = str(row['article_id'])
            pdf_url = row['pdf_url']
            
            if pd.isna(pdf_url):
                continue
            
            # Find PDF file (try different naming patterns)
            pdf_filename = None
            potential_names = [
                f"article_{article_id}.pdf",
                f"{article_id}.pdf",
                f"article_{article_id}_*.pdf"  # Will need glob for this
            ]
            
            # Look for PDF file
            for pdf_file in os.listdir(PDF_DIR):
                if article_id in pdf_file and pdf_file.endswith('.pdf'):
                    pdf_filename = pdf_file
                    break
            
            if pdf_filename:
                local_path = os.path.join(PDF_DIR, pdf_filename)
                s3_key = f"{PDF_PREFIX}article_{article_id}.pdf"
                
                total += 1
                if self.upload_file(local_path, s3_key, 'application/pdf'):
                    uploaded += 1
            else:
                print(f"⚠️  PDF not found for article {article_id}")
        
        print(f"\n📊 PDFs: {uploaded}/{total} uploaded successfully")
    
    def upload_graphical_abstracts(self, df):
        """Upload graphical abstract images to S3."""
        print(f"\n🖼️  Uploading Graphical Abstracts from {IMG_DIR}")
        
        if not os.path.exists(IMG_DIR):
            print(f"❌ Image directory not found: {IMG_DIR}")
            return
        
        uploaded = 0
        total = 0
        
        for index, row in df.iterrows():
            article_id = str(row['article_id'])
            img_url = row['graphical_abstract_url']
            
            if pd.isna(img_url):
                continue
            
            # Find image file
            img_filename = None
            for img_file in os.listdir(IMG_DIR):
                if article_id in img_file and img_file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    img_filename = img_file
                    break
            
            if img_filename:
                local_path = os.path.join(IMG_DIR, img_filename)
                
                # Determine file extension
                _, ext = os.path.splitext(img_filename)
                s3_key = f"{IMG_PREFIX}graphical_abstract_{article_id}{ext}"
                
                # Determine content type
                content_type = 'image/png'
                if ext.lower() in ['.jpg', '.jpeg']:
                    content_type = 'image/jpeg'
                elif ext.lower() == '.gif':
                    content_type = 'image/gif'
                
                total += 1
                if self.upload_file(local_path, s3_key, content_type):
                    uploaded += 1
            else:
                # This is expected for many articles
                pass
        
        print(f"\n📊 Images: {uploaded}/{total} uploaded successfully")
    
    def generate_upload_manifest(self, df):
        """Generate a manifest file of all uploaded files."""
        manifest = {
            'upload_date': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_articles': len(df),
            'files': {
                'pdfs': [],
                'images': []
            }
        }
        
        # Check uploaded PDFs
        for index, row in df.iterrows():
            article_id = str(row['article_id'])
            pdf_key = f"{PDF_PREFIX}article_{article_id}.pdf"
            
            try:
                self.s3_client.head_object(Bucket=S3_BUCKET, Key=pdf_key)
                manifest['files']['pdfs'].append({
                    'article_id': article_id,
                    's3_key': pdf_key,
                    'url': f"https://{S3_BUCKET}.s3.amazonaws.com/{pdf_key}"
                })
            except ClientError:
                pass
        
        # Check uploaded images
        for index, row in df.iterrows():
            article_id = str(row['article_id'])
            for ext in ['.png', '.jpg', '.jpeg', '.gif']:
                img_key = f"{IMG_PREFIX}graphical_abstract_{article_id}{ext}"
                try:
                    self.s3_client.head_object(Bucket=S3_BUCKET, Key=img_key)
                    manifest['files']['images'].append({
                        'article_id': article_id,
                        's3_key': img_key,
                        'url': f"https://{S3_BUCKET}.s3.amazonaws.com/{img_key}"
                    })
                    break
                except ClientError:
                    continue
        
        # Save manifest
        manifest_file = '/Users/narayana/Herd/aml_iaamonline/aml_iaamonline-frontend/lib/upload_manifest.json'
        with open(manifest_file, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        print(f"\n📋 Upload manifest saved to: {manifest_file}")
        print(f"📊 Summary:")
        print(f"   - PDFs uploaded: {len(manifest['files']['pdfs'])}")
        print(f"   - Images uploaded: {len(manifest['files']['images'])}")
        
        return manifest

def main():
    """Main function to upload files to S3."""
    print("🚀 AML S3 Uploader")
    print("=" * 50)
    
    # Load article data
    if not os.path.exists(EXCEL_FILE):
        print(f"❌ Excel file not found: {EXCEL_FILE}")
        return
    
    print(f"📊 Loading article data from {EXCEL_FILE}")
    df = pd.read_excel(EXCEL_FILE)
    print(f"📈 Found {len(df)} articles")
    
    # Initialize uploader
    uploader = S3Uploader()
    
    # Upload files
    uploader.upload_pdfs(df)
    uploader.upload_graphical_abstracts(df)
    
    # Generate manifest
    manifest = uploader.generate_upload_manifest(df)
    
    print("\n🎉 Upload process completed!")
    print(f"🔗 Files are now available at: https://{S3_BUCKET}.s3.amazonaws.com/")

if __name__ == "__main__":
    main()