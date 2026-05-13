// src/utils/auth.ts
import type { IdentityContext, UserRole } from '@/types';

export function isParent(identity: IdentityContext): boolean {
  return identity.activeRole === 'parent';
}

export function isTeacher(identity: IdentityContext): boolean {
  return identity.activeRole === 'teacher';
}

export function isHeadTeacher(identity: IdentityContext): boolean {
  return identity.activeRole === 'teacher' && identity.isHeadTeacher === true;
}

export function canApproveLeave(identity: IdentityContext): boolean {
  return identity.activeRole === 'teacher';
}

export function canManageDuty(identity: IdentityContext): boolean {
  return isHeadTeacher(identity);
}

export function canViewChildUpdates(identity: IdentityContext): boolean {
  return identity.activeRole === 'parent';
}
