import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const CustomerScalarFieldEnumSchema = z.enum(['id','companyName','addressLine1','addressLine2','postalCode','city','taxId','name','surname','position','mail','phone','companySize','projectFor']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','role']);

export const VMPRoleSchema = z.enum(['NONE','CLIENT','VENDOR','ADMIN']);

export type VMPRoleType = `${z.infer<typeof VMPRoleSchema>}`

export const ProjectForSchema = z.enum(['INTERNAL','EXTERNAL']);

export type ProjectForType = `${z.infer<typeof ProjectForSchema>}`

export const CompanySizeSchema = z.enum(['BELOW10','FROM11TO50','FROM50TO250','FROM250TO1000','ABOVE1000']);

export type CompanySizeType = `${z.infer<typeof CompanySizeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: VMPRoleSchema,
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// CUSTOMER SCHEMA
/////////////////////////////////////////

export const CustomerSchema = z.object({
  companySize: CompanySizeSchema,
  projectFor: ProjectForSchema,
  id: z.string().min(3),
  companyName: z.string().min(3),
  addressLine1: z.string().min(3),
  addressLine2: z.string().min(3),
  postalCode: z.string().min(3),
  city: z.string().min(3),
  taxId: z.string().min(3),
  name: z.string().min(3),
  surname: z.string().min(3),
  position: z.string().min(3),
  mail: z.string().min(3),
  phone: z.string().min(3),
})

export type Customer = z.infer<typeof CustomerSchema>
