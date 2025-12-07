import React from 'react';
import useSEO from '../hooks/useSEO';

const SEOHead = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  tags = [],
  category,
  readTime,
  noIndex = false
}) => {
  useSEO({
    title,
    description,
    keywords,
    image,
    url,
    type,
    author,
    publishedTime,
    modifiedTime,
    tags,
    category,
    readTime,
    noIndex
  });

  return null; // This component doesn't render anything
};

export default SEOHead;