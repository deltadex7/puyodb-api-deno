interface NameJP {
  unicode: string;
  latin: string;
}

export interface Character {
  id: string;
  name: string;
  nameJP: NameJP;
  alias: string[];
  gender: string;
  description: string;
  birthday?: string;
  bloodType?: string;
  age?: number;
  height?: number;
  weight?: number;
  firstAppear?: string;
  lastAppear?: string;
}
