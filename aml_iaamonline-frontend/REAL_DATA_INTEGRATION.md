# Real Data Integration Guide

This guide explains how the AML application has been integrated with real data from the Excel file and S3 storage.

## Overview

The application now uses real article data from `/Users/narayana/Documents/SOProjects/Scrape/aml_articles.xlsx` instead of mock data. The system includes:

1. **Data Processing**: Converts Excel data to JSON format
2. **S3 Integration**: Uploads PDFs and graphical abstracts to AWS S3
3. **Real-time Loading**: Application loads 1,620+ real articles

## Data Structure

### Excel File Columns
- `article_id`: Unique identifier
- `title`: Article title
- `abstract`: Article abstract
- `authors`: Semicolon-separated author list
- `publication_date`: Publication date
- `volume`, `issue`: Journal volume and issue
- `doi`: Digital Object Identifier
- `keywords`: Semicolon-separated keywords
- `pdf_url`: Original PDF URL
- `graphical_abstract_url`: Original image URL

### Generated JSON Structure
```json
{
  "id": "13708",
  "type": "Research Article",
  "title": "Article Title",
  "authors": ["Author 1", "Author 2"],
  "affiliations": ["Institution"],
  "abstract": "Article abstract...",
  "subject": "Materials Science",
  "published": "2013-01-01",
  "year": 2013,
  "volume": "4",
  "issue": "10",
  "doi": "10.5185/amlett.2013.10001",
  "pages": "1-12",
  "views": 150,
  "cited": 5,
  "keywords": ["keyword1", "keyword2"],
  "pdf_url": "https://authors-iaamonline.s3.amazonaws.com/aml/pdf/articles/article_13708.pdf",
  "graphical_abstract_url": "https://authors-iaamonline.s3.amazonaws.com/aml/img/Graphical Abstract/graphical_abstract_13708.png"
}
```

## Data Processing

### Running the Data Processor

```bash
# Navigate to the scrape directory and activate virtual environment
cd /Users/narayana/Documents/SOProjects/Scrape/
source venv/bin/activate

# Run the data processing script
python /Users/narayana/Herd/aml_iaamonline/aml_iaamonline-frontend/scripts/process-data.py
```

### What the Processor Does

1. **Reads Excel File**: Loads all 1,649 articles from Excel
2. **Data Cleaning**: 
   - Normalizes text content
   - Parses author lists
   - Extracts keywords
   - Determines article types
   - Maps keywords to subject categories
3. **S3 URL Generation**: Creates S3 URLs for PDFs and images
4. **Statistics**: Generates summary statistics
5. **JSON Export**: Saves processed data to `lib/articles_data.json`

### Results
- **Total Articles Processed**: 1,620 (29 skipped due to missing data)
- **Subjects**: 10 categories (Materials Science, Nanomaterials, etc.)
- **Types**: Research Article, Review, Letter, Editorial
- **Year Range**: 2010-2026

## S3 Integration

### S3 Bucket Structure
- **PDFs**: `s3://authors-iaamonline/aml/pdf/articles/`
- **Images**: `s3://authors-iaamonline/aml/img/Graphical Abstract/`

### File Naming Convention
- **PDFs**: `article_{article_id}.pdf`
- **Images**: `graphical_abstract_{article_id}.{ext}`

### Running S3 Uploader

**Prerequisites:**
```bash
# Install dependencies
pip install boto3 pandas

# Configure AWS credentials
aws configure
# OR set environment variables:
# export AWS_ACCESS_KEY_ID=your_key
# export AWS_SECRET_ACCESS_KEY=your_secret
# export AWS_DEFAULT_REGION=us-east-1
```

**Upload Files:**
```bash
cd /Users/narayana/Documents/SOProjects/Scrape/
source venv/bin/activate
python /Users/narayana/Herd/aml_iaamonline/aml_iaamonline-frontend/scripts/s3-uploader.py
```

### S3 Uploader Features

1. **Duplicate Detection**: Skips files already uploaded
2. **File Validation**: Checks file existence before upload
3. **Public Access**: Sets ACL for public read access
4. **Content Type Detection**: Sets proper MIME types
5. **Progress Tracking**: Shows upload progress
6. **Manifest Generation**: Creates upload manifest file

## Application Integration

### Files Updated
- `lib/realData.ts`: New data source with real articles
- `app/article/[id]/page.tsx`: Uses real data instead of hardcoded
- `components/homepage/featured-content.tsx`: Updated import
- `components/pages/browse-page.tsx`: Updated import

### Key Features
- **Real Articles**: 1,620+ articles loaded from JSON
- **Dynamic Subjects**: Subject categories generated from actual data
- **Archive Volumes**: Years and volumes from real publication data
- **Search & Filter**: Works with real article content
- **Article Pages**: Display real article data by ID

### Helper Functions Available

```typescript
import { 
  getArticlesBySubject,
  getArticlesByYear,
  searchArticles,
  getFeaturedArticles,
  getRecentArticles,
  getMostCitedArticles,
  ARTICLE_STATS
} from '@/lib/realData';

// Get articles by subject
const nanoArticles = getArticlesBySubject('Nanomaterials');

// Search articles
const searchResults = searchArticles('polymer');

// Get stats
console.log(ARTICLE_STATS.total); // 1620
console.log(ARTICLE_STATS.bySubject); // Subject distribution
```

## Statistics Summary

### Article Distribution
- **Materials Science**: 944 articles (58.3%)
- **Nanomaterials**: 164 articles (10.1%)
- **Composites**: 120 articles (7.4%)
- **Polymer Science**: 105 articles (6.5%)
- **Energy Materials**: 98 articles (6.0%)

### Publication Timeline
- **Peak Years**: 2015-2017 (175-186 articles/year)
- **Recent**: 2022-2025 (88 articles total)
- **Coverage**: 16 years (2010-2026)

### Article Types
- **Research Articles**: 1,450 (89.5%)
- **Reviews**: 100 (6.2%)
- **Letters**: 66 (4.1%)
- **Editorials**: 4 (0.2%)

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure TypeScript types match the interface
2. **Missing Data**: Some articles may lack abstracts or authors
3. **S3 Access**: Check AWS credentials and bucket permissions
4. **Large JSON**: The articles_data.json file is ~2MB

### Performance Considerations

1. **Initial Load**: JSON loads all articles at startup
2. **Search**: Client-side filtering (fast for current dataset size)
3. **Images**: Lazy loading recommended for article images
4. **Pagination**: Consider implementing for browse pages

## Future Enhancements

1. **Database Integration**: Move from JSON to database for better performance
2. **Image Optimization**: Compress and resize graphical abstracts
3. **Full-text Search**: Implement proper search with indexing
4. **CDN**: Use CloudFront for better S3 performance
5. **Incremental Updates**: System for adding new articles

## Maintenance

### Adding New Articles
1. Add new rows to Excel file
2. Run data processor script
3. Upload new files to S3
4. Rebuild and deploy application

### Updating Existing Articles
1. Modify Excel file
2. Re-run data processor
3. Re-upload modified files to S3
4. Rebuild application

---

**Note**: This integration provides a solid foundation for the AML journal platform with real research data, proper file storage, and scalable architecture.