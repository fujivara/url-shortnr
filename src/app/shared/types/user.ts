import {UrlInterface} from "./url";

export interface UserInterface {
  username: string;
  full_name: string | null;
  links: UrlInterface[];
}