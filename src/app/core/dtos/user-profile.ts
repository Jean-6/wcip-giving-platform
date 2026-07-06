
export type UserRole = 'MEMBER' | 'ADMIN' | 'TREASURER' | 'PASTOR';

export interface UserPrivilege{
  code: string;
  label: string;
  description: string;
}


export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];

}
