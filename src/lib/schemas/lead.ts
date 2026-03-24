import { z } from 'zod';

const FLEET_SIZE_VALUES = ['1-10', '11-50', '51-100', '101-250', '250+'] as const;

export const FLEET_SIZE_OPTIONS = FLEET_SIZE_VALUES.map((value) => ({
  value,
  label: value === '250+' ? '250+ aircraft' : `${value} aircraft`,
}));

export const leadSubmissionSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be under 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be under 200 characters'),
  jobTitle: z
    .string()
    .min(1, 'Job title is required')
    .max(100, 'Job title must be under 100 characters'),
  fleetSize: z.enum(FLEET_SIZE_VALUES, {
    error: 'Please select a fleet size range',
  }),
  message: z
    .string()
    .max(2000, 'Message must be under 2000 characters')
    .optional(),
  selectedTier: z.string().optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmTerm: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
});

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;
