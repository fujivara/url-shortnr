export interface UserInterface {
  username: string;
  full_name: string | null;
  links: number;
}

export interface CreateUserPayload extends Omit<UserInterface, 'links'>{
  password: string;
}

export interface LoginUserPayload extends Omit<UserInterface, 'links' | 'full_name'> {
  password: string;
}