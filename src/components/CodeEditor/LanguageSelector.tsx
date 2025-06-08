import { Select } from 'antd';

import { LANG_VERSIONS, LangVersionType } from '../../utils/constants/codeLanguage';
import React from 'react';

type LanguageSelectorType = {
  language: LangVersionType;
  onSelect: (value: LangVersionType) => void;
};

const languageOptions = LANG_VERSIONS.map((language) => ({
  label: language.name,
  value: language.name
}));

const LanguageSelector: React.FC<LanguageSelectorType> = React.memo(({ language, onSelect }) => {
  const handleChange = (value: string) => {
    const selectedLanguage = LANG_VERSIONS.find((lang) => lang.name === value);
    if (selectedLanguage) {
      onSelect(selectedLanguage);
    }
  };

  return (
    <Select
      className="my-3"
      defaultValue={language.name || LANG_VERSIONS[0].name}
      style={{ maxWidth: 120 }}
      onChange={handleChange}
      options={languageOptions}
    />
  );
});

export default LanguageSelector;
