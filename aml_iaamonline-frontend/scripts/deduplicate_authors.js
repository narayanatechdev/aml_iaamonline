const fs = require('fs');
const path = require('path');

// Path to authors data file
const authorsFile = path.join(__dirname, '../lib/authors_data.json');

console.log('Reading authors data...');
const authorsData = JSON.parse(fs.readFileSync(authorsFile, 'utf8'));

console.log(`Original authors count: ${authorsData.length}`);

// Remove duplicates by ID first
const uniqueById = authorsData.filter((author, index, self) => 
  index === self.findIndex(a => a.id === author.id)
);

console.log(`After ID deduplication: ${uniqueById.length}`);

// Remove duplicates by name (case-insensitive)
const uniqueByName = uniqueById.filter((author, index, self) => 
  index === self.findIndex(a => 
    a.name.toLowerCase().trim() === author.name.toLowerCase().trim()
  )
);

console.log(`After name deduplication: ${uniqueByName.length}`);

// Sort by name for better organization
const sortedAuthors = uniqueByName.sort((a, b) => 
  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
);

// Write the deduplicated data back to the file
const jsonContent = JSON.stringify(sortedAuthors, null, 2);
fs.writeFileSync(authorsFile, jsonContent);

console.log(`✅ Deduplicated authors saved to: ${authorsFile}`);
console.log(`Removed ${authorsData.length - uniqueByName.length} duplicates`);
console.log(`Final count: ${uniqueByName.length} unique authors`);

// Show some statistics
const realAffiliations = uniqueByName.filter(author => 
  author.affiliation && author.affiliation !== 'Research Institution'
).length;

const withCountry = uniqueByName.filter(author => author.country).length;
const withEmail = uniqueByName.filter(author => author.email).length;

console.log(`\nStatistics:`);
console.log(`- Authors with real affiliations: ${realAffiliations}`);
console.log(`- Authors with country info: ${withCountry}`);
console.log(`- Authors with email: ${withEmail}`);