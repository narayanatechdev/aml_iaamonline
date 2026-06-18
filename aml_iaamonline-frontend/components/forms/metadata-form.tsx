'use client';

import { AlertCircle } from 'lucide-react';

interface Author {
  name: string;
  contribution: string;
}

interface MetadataFormProps {
  acknowledgements?: string;
  fundingInformation?: string;
  conflictOfInterest?: string;
  authors?: Author[];
  dataAvailability?: string;
  onChange?: (data: MetadataFormData) => void;
  errors?: Record<string, string>;
}

export interface MetadataFormData {
  acknowledgements: string;
  fundingInformation: string;
  conflictOfInterest: string;
  authorContributions: Author[];
  dataAvailability: string;
}

export function MetadataForm({
  acknowledgements = '',
  fundingInformation = '',
  conflictOfInterest = '',
  authors = [],
  dataAvailability = '',
  onChange,
  errors = {},
}: MetadataFormProps) {
  const handleChange = (field: string, value: any) => {
    if (onChange) {
      onChange({
        acknowledgements,
        fundingInformation,
        conflictOfInterest,
        authorContributions: authors,
        dataAvailability,
        [field]: value,
      } as any);
    }
  };

  const handleAuthorContributionChange = (index: number, field: 'name' | 'contribution', value: string) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index] = {
      ...updatedAuthors[index],
      [field]: value,
    };

    if (onChange) {
      onChange({
        acknowledgements,
        fundingInformation,
        conflictOfInterest,
        authorContributions: updatedAuthors,
        dataAvailability,
      });
    }
  };

  const FormField = ({
    label,
    name,
    value,
    onChange: onFieldChange,
    error,
    isTextarea = false,
    maxLength,
    hint,
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    isTextarea?: boolean;
    maxLength?: number;
    hint?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-black">
        {label}
        <span className="text-gray-600 font-normal ml-1">(optional)</span>
      </label>

      {hint && <p className="text-xs text-gray-600">{hint}</p>}

      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onFieldChange(e.target.value)}
          maxLength={maxLength}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 resize-vertical min-h-32"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onFieldChange(e.target.value)}
          maxLength={maxLength}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}

      {maxLength && (
        <p className="text-xs text-gray-600">
          {value.length} / {maxLength} characters
        </p>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-black mb-6">Article Metadata</h3>
        <p className="text-sm text-gray-600 mb-6">
          Provide additional information about your article. All fields are optional.
        </p>
      </div>

      <FormField
        label="Acknowledgements"
        name="acknowledgements"
        value={acknowledgements}
        onChange={(value) => handleChange('acknowledgements', value)}
        error={errors.acknowledgements}
        isTextarea
        maxLength={2000}
        hint="Thank individuals or organizations that contributed to the research"
      />

      <FormField
        label="Funding Information"
        name="fundingInformation"
        value={fundingInformation}
        onChange={(value) => handleChange('fundingInformation', value)}
        error={errors.fundingInformation}
        isTextarea
        maxLength={1000}
        hint="Describe funding sources, grants, or financial support for this work"
      />

      <FormField
        label="Conflict of Interest"
        name="conflictOfInterest"
        value={conflictOfInterest}
        onChange={(value) => handleChange('conflictOfInterest', value)}
        error={errors.conflictOfInterest}
        isTextarea
        maxLength={1000}
        hint="Disclose any financial or personal relationships that could bias this work"
      />

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-black">
          Author Contributions
          <span className="text-gray-600 font-normal ml-1">(optional)</span>
        </label>
        <p className="text-xs text-gray-600">
          Describe each author's role in the research and manuscript preparation
        </p>

        <div className="space-y-4">
          {authors.map((author, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-gray-600">Author {index + 1}</div>

              <input
                type="text"
                value={author.name}
                onChange={(e) => handleAuthorContributionChange(index, 'name', e.target.value)}
                placeholder="Author name"
                className="w-full px-3 py-2 rounded border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20"
              />

              <textarea
                value={author.contribution}
                onChange={(e) => handleAuthorContributionChange(index, 'contribution', e.target.value)}
                placeholder="e.g., Conceived and designed the study, acquired data, analyzed results..."
                maxLength={500}
                className="w-full px-3 py-2 rounded border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 resize-none min-h-20"
              />

              <p className="text-xs text-gray-600">
                {author.contribution.length} / 500 characters
              </p>
            </div>
          ))}
        </div>
      </div>

      <FormField
        label="Data Availability"
        name="dataAvailability"
        value={dataAvailability}
        onChange={(value) => handleChange('dataAvailability', value)}
        error={errors.dataAvailability}
        isTextarea
        maxLength={1000}
        hint="Describe how readers can access the data used in this study (or explain why it's unavailable)"
      />

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="text-xs font-semibold text-black">Metadata Guidelines</h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            All fields are optional
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Be concise but comprehensive
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Disclose all relevant conflicts
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Follow journal guidelines if applicable
          </li>
        </ul>
      </div>
    </div>
  );
}
