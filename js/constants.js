/* js/constants.js — shared constants */
const OVERALL_STATUSES = {
  PRELIMINARY_COMPLIANT: {
    label: 'Preliminary Compliant',
    cssClass: 'compliant',
    desc: 'All mandatory declarations were detected in the submitted image. Officer verification is still required.',
  },
  POTENTIAL_NON_COMPLIANCE: {
    label: 'Potential Non-Compliance',
    cssClass: 'issue',
    desc: 'One or more mandatory declarations were not detected. This is a preliminary finding only — manual inspection is required.',
  },
  NEEDS_OFFICER_REVIEW: {
    label: 'Needs Officer Review',
    cssClass: 'review',
    desc: 'Some declarations require manual verification. Officer review is strongly recommended.',
  },
  INSUFFICIENT_IMAGE_QUALITY: {
    label: 'Insufficient Image Quality',
    cssClass: 'insufficient',
    desc: 'OCR confidence is too low for reliable assessment. Please upload a clearer photograph of the package.',
  },
};
