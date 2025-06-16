export interface Product {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  images: string[];
  phone: string;
  storeName: string;
  storeDNI: string;
  storeLogo: string;
  facebookLink?: string;
  instagramLink?: string;
  categoria: string;
  id_community: string;
  id_store: string;
}