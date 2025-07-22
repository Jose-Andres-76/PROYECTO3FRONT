export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
  message: string,
  meta: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  longitude?: string;
  latitude?: string;
  age?: number;
  active?: boolean;
  urlImage?: string;
  publicIdCloudinary?: string;
  points?: number;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRoleType {
  admin = "ROLE_ADMIN",
  father = "ROLE_FATHER",
  son = 'ROLE_SON'
}

export interface IRole {
  createdAt: string;
  description: string;
  id: number;
  name : string;
  updatedAt: string;
}
export interface IGame {
  id?: number;
  typesOfGames?: string;
  description?: string;
}

export interface IOrder {
  id?: number;
  description?: string;
  total?: number;
}

export interface ISearch {
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?:number;
}


export interface IFamily {
  id?: number;
  son?: IUser;
  father?: IUser;
  idSon?: IUser;
  idFather?: IUser;
}

export interface IReward {
  id?: number;
  family?: {  
    id: number;
  }; 
  cost?: number;
  description?: string;
  status?: boolean;
}

export interface IChallenge {
  id?: number;
  family?: {
    id: number;
  };
  game?: {
    id: number;
  };
  points?: number;
  challengeStatus?: boolean;
  description?: string;
}

export interface IWaste {
  id?: number;
  userId?: number;
  user?: IUser;
  productType?: string;
  answer?: string;
  createdAt?: Date;
}

export interface IWasteCreateRequest {
  userId: number;
  productType?: string;
  answer?: string;
}

export interface IWasteUpdateRequest {
  productType?: string;
  answer?: string;
}

export interface IWasteStats {
  totalCount: number;
}
